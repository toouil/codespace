<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use App\Notifications\PostReacted;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        try {
            $posts = $this->getAllPosts($request);

            if ($posts["status"] == 200) {
                return Inertia::render('Posts/AllPosts', ['posts' => $posts["data"]]);
            }

            return response('Something went wrong !!!', 500);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()], 404);
        }
    }

    public function renderPostsByTag(Request $request)
    {
        try {
            $posts = $this->getPostsByTag($request);

            if ($posts["status"] == 200) {
                return Inertia::render('Posts/PostsByTag', ['posts' => $posts["data"], "tag"=> $request->tag]);
            }

            return response('Something went wrong !!!', 500);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()], 404);
        }
    }

    public function renderPostsByQuery(Request $request)
    {
        try {
            $posts = $this->getPostsByQuery($request);

            if ($posts["status"] == 200) {
                return Inertia::render('Posts/PostsByQuery', ['posts' => $posts["data"], "query"=> $request->query("query")]);
            }

            return response('Something went wrong !!!', 500);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()], 404);
        }
    }

    public function renderPostsByUser(Request $request)
    {
        try {
            $posts = $this->fetchPosts($request->user()->userid);

            if ($posts["status"] == 200) {
                return Inertia::render('Index', ['posts' => $posts["data"]]);
            }

            return response('Something went wrong !!!', 500);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()], 404);
        }
    }

    public function addPost(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'content' => ['required']
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 404, 'error' => $validator->messages()]);
            }

            $request->user()->posts()->create([
                'tags' => $request->tags,
                'content' => htmlspecialchars($request->content),
                'visibility' => $request->visibility
            ]);

            return response()->json(['status' => 200], 200);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()]);
        }
    }

    public function getAllPosts(Request $request)
    {
        return $this->fetchPosts($request->user()->userid);
    }

    public function getPostsByTag(Request $request)
    {
        return $this->fetchPosts($request->user()->userid, ['posts.tags', 'like', '%' . $request->tag . '%']);
    }

    public function getPostsByQuery(Request $request)
    {
        if ($request->query('query') != null) {
            return $this->fetchPosts($request->user()->userid, function($query) use ($request) {
                $query->where('posts.tags', 'like', '%' . $request->query('query') . '%')
                ->orWhere('posts.content', 'like', '%' . $request->query('query') . '%');
            });
        }

        return [ "status" => 200, "data" => []];
    }

    public function getPostsByUser(Request $request)
    {
        $posts_userId = User::where('username', $request->username)->value('userid');
        if (!$posts_userId) {
            return response()->json(['status' => 404]);
        }
        return $this->fetchPosts($request->user()->userid, ['posts.posted_by', "=", $posts_userId]);
    }


    private function fetchPosts($userId, $filter = null): array
    {
        try {
            $posts = $this->buildPostQuery($userId, $filter)->get()
                ->filter(function($post) use ($userId) {
                    return $post->visibility === "public" || $post->posted_by === $userId;
                })
                ->map(function($post) {
                    $post->formatted_created_at = Carbon::parse($post->created_at)->toDayDateTimeString();
                    $post->age = Carbon::parse($post->created_at)->diffForHumans();
                    return $post;
                })
                ->values()
                ->toArray();

            return ["status" => 200, "data" => $posts];
        } catch (Exception $err) {
            return ["status" => 404, "error" => $err->getMessage()];
        }
    }

    private function buildPostQuery($userId, $filter = null)
    {
        $query = Post::select(
                'posts.*',
                'users.username',
                'users.picture',
                DB::raw('IF(COUNT(DISTINCT user_likes.id) > 0, true, false) AS isLiked')
            )
            ->leftJoin('likes', 'likes.postid', '=', 'posts.postid')
            ->leftJoin('comments', 'comments.postid', '=', 'posts.postid')
            ->leftJoin('users AS user_likes', function ($join) use ($userId) {
                $join->on('user_likes.userid', '=', 'likes.liked_by')
                    ->where('user_likes.userid', '=', $userId);
            })
            ->join('users', 'users.userid', '=', 'posts.posted_by')
            ->groupBy('posts.postid', 'users.username', 'users.picture', 'posts.id', 'posts.posted_by', 'posts.visibility', 'posts.tags', 'posts.content', 'posts.created_at', 'posts.updated_at', "posts.likes", "posts.comments")
            ->orderBy('posts.created_at', 'DESC')
            ->orderBy('posts.updated_at', 'DESC');

        if ($filter) {
            if (is_callable($filter)) {
                $query->where($filter);
            } else {
                $query->where($filter[0], $filter[1], $filter[2]);
            }
        }

        return $query;
    }

    public function likePost(Request $request) {
        try {
            $postId = $request->postid;
            $user = $request->user();
            $liked = Like::where('postid', $postId)->where('liked_by', $user->userid)->first();
            $like = false;

            if ($liked) {
                $liked->delete();
                Post::where('postid', $postId)->decrement('likes');
            } else {
                Like::create([
                    'postid' => $postId,
                    'liked_by' => $user->userid,
                ]);
                Post::where('postid', $postId)->increment('likes');
                $like = true;
            }
            
            $count = Post::where('postid', $postId)->value('likes');
            return response()->json(['status' => 200, 'data' => ['liked' => $like, 'count' => $count]]);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'data' => $err->getMessage()], 404);
        }
    }

    public function commentPost(Request $request) {
        try {
            $postId = $request->postid;
            $user = $request->user();
            $post = Post::where("postid", $postId)->first();
            $postUser = User::where("userid", $post->posted_by)->first();

            $validator = Validator::make($request->all(), [
                'postid' => ['required', 'starts_with:post_'],
                'content' => ['required'],
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 404, 'data' => $validator->messages()], 404);
            }

            $comment = Comment::create([
                'postid' => $postId,
                'commented_by' => $user->userid,
                'content' => $request->content,
            ]);
            Post::where('postid', $postId)->increment('comments');
            $postUser->notify(new PostReacted('comment'));

            return response()->json(['status' => 200, 'data' => $comment], 200);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'data' => $err->getMessage()], 404);
        }
    }

    public function getPostComments(Request $request){
        try {
            $comments = Comment::select('comments.*', 'users.username', 'users.picture')
                ->where('postid', $request->postid)
                ->join('users', 'users.userid', '=', 'comments.commented_by')
                ->orderBy('comments.created_at', 'desc')
                ->get()->map(function($comment) {
                    $comment->formatted_created_at  = Carbon::parse($comment->created_at)->toDayDateTimeString();
                    $comment->age = Carbon::parse($comment->created_at)->diffForHumans();
                    return $comment;
                });

            return response()->json(['status' => 200, 'data' => $comments], 200);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'data' => $err->getMessage()], 404);
        }
    }
}