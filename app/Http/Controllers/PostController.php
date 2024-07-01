<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Str;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Notification;
use App\Models\Post;
use App\Models\SavedPost;
use App\Models\User;
use App\Notifications\PostReacted;
use Carbon\Carbon;
use Error;
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
                return Inertia::render('Posts/AllPosts', ['posts' => $posts["data"]])
                ->withViewData([
                    "title" => $request->user()->username . " | CodeSpace",
                    "description" => "Welcome to codespace , here is the newest posts",
                    "keywords" => "codespace posts, codespace home page"
                ]);
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
                return Inertia::render('Posts/PostsByTag', ['posts' => $posts["data"], "tag"=> $request->tag])
                ->withViewData([
                    "title" => "#" . $request->tag . " - Explore codeSpace",
                    "description" => "See what people post under " . $request->tag . " tag",
                    "keywords" => $request->tag. " tag, find by tag"
                ]);
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
                return Inertia::render('Posts/PostsByQuery', ['posts' => $posts["data"], "query"=> $request->query("query")])
                ->withViewData([
                    "title" => $request->query("query") . " - Search Results",
                    "description" => "Search results for" . $request->query("query"),
                    "keywords" => $request->query("query") . "search, find post"
                ]);
            }

            return response('Something went wrong !!!', 500);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()], 404);
        }
    }
    
    public function renderPostsBySave(Request $request)
    {
        try {
            $posts = $this->getPostsBySave($request);

            if ($posts["status"] == 200) {
                return Inertia::render('Posts/PostsBySave', ['posts' => $posts["data"]])
                ->withViewData([
                    "title" => "Saved posts",
                    "description" => "Youre saved posts",
                    "keywords" =>  "save, saved posts"
                ]);
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

            $user = $request->user();

            //formate content :
            $lines = explode("\n", $request->content);
            $filteredLines = array_filter($lines, function($line) {
                return !empty(trim($line));
            });
            $request["content"] = implode("\n", $filteredLines);


            //formate tags :
            $tags = explode(",", $request->tags);
            $cleanedTags = array_map(function($tag) {
                $tag = preg_replace('/  +/', ' ', $tag);
                return preg_replace('/[^a-zA-Z0-9, ]/', '', $tag);
            }, $tags);
            $request["tags"] = implode(",", $cleanedTags);


            if ($request->postid) {

                $post = Post::where("postid", $request->postid)->first();

                if ($post) {
                    if ($post->posted_by == $user->userid) {
                        $post->update([
                            'tags' => $request->tags,
                            'content' => htmlspecialchars($request->content),
                            'visibility' => $request->visibility
                        ]);
        
                        return response()->json(['status' => 200], 200);
                    }
                    else {
                        throw new Exception("You cant edit this post");
                    }
                }
                else {
                    throw new Exception("Post not found");
                }
            }

            $user->posts()->Create([
                'tags' => $request->tags,
                'content' => htmlspecialchars($request->content),
                'visibility' => $request->visibility
            ]);
    
            return response()->json(['status' => 200], 200);
        } catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()]);
        }
    }

    public function deletePost (Request $request) {
        try {
            $post = Post::where("postid", $request->postid)->first();
            if ($post) {
                if ($request->user()->userid == $post->posted_by) {
                    $post->delete();
                    return response()->json(['status' => 200], 200);
                }

                throw new Exception("You cant delete this post");
            }

            throw new Exception("Post not found");
        }
        catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()]);
        }
    }

    public function savePost (Request $request) {
        try {
            $post = Post::where("postid", $request->postid)->first();

            if ($post) {
                $savedPost = $post->savedPosts()->where("saved_by", $request->user()->userid)->first();

                if ($savedPost) {
                    $savedPost->delete();
                    return response()->json(['status' => 200, "saved" => false], 200);
                }

                $request->user()->savedPosts()->create([
                    "postid" => $post->postid
                ]);

                return response()->json(['status' => 200, "saved" => true], 200);
            }

            throw new Exception("Post not found");
        }
        catch (Exception $err) {
            return response()->json(['status' => 404, 'error' => $err->getMessage()]);
        }
    }

    public function getAllPosts(Request $request)
    {   
        try {
            $user = $request->user();

            $query = Post::select(
                'posts.*',
                'users.username',
                'users.picture',
                DB::raw('IF(likes.liked_by IS NOT NULL, TRUE, FALSE) as isLiked'),
                DB::raw('IF(saved_posts.saved_by IS NOT NULL, TRUE, FALSE) as isSaved')
            )
            ->join('users', 'users.userid', '=', 'posts.posted_by')
            ->leftJoin('likes', function($join) use ($user) {
                $join->on('posts.postid', '=', 'likes.postid')
                    ->where('likes.liked_by', '=', $user->userid);
            })
            ->leftJoin('saved_posts', function($join) use ($user) {
                $join->on('posts.postid', '=', 'saved_posts.postid')
                    ->where('saved_posts.saved_by', '=', $user->userid);
            })
            ->groupBy('posts.postid', 'users.username', 'users.picture', 'posts.id', 'posts.posted_by', 'posts.visibility', 'posts.tags', 'posts.content', 'posts.created_at', 'posts.updated_at', 'posts.likes', 'posts.comments', 'likes.liked_by', "saved_posts.saved_by")
            ->orderBy('posts.created_at', 'DESC')
            ->orderBy('posts.updated_at', 'DESC')
            ->get();
    
            $posts = filterPosts($query, $user);
            
            return [ "status" => 200, "data" => $posts];
        }
        catch (Exception $err) {
            return [ "status" => 404];
        }
    }

    public function getPostsByTag(Request $request)
    {
        try {
        $user = $request->user();

        $query = Post::select(
            'posts.*',
            'users.username',
            'users.picture',
            DB::raw('IF(likes.liked_by IS NOT NULL, TRUE, FALSE) as isLiked'),
            DB::raw('IF(saved_posts.saved_by IS NOT NULL, TRUE, FALSE) as isSaved')
        )
        ->where('posts.tags', 'like', '%' . $request->tag . '%')
        ->join('users', 'users.userid', '=', 'posts.posted_by')
        ->leftJoin('likes', function($join) use ($user) {
            $join->on('posts.postid', '=', 'likes.postid')
                ->where('likes.liked_by', '=', $user->userid);
        })
        ->leftJoin('saved_posts', function($join) use ($user) {
            $join->on('posts.postid', '=', 'saved_posts.postid')
                ->where('saved_posts.saved_by', '=', $user->userid);
        })
        ->groupBy('posts.postid', 'users.username', 'users.picture', 'posts.id', 'posts.posted_by', 'posts.visibility', 'posts.tags', 'posts.content', 'posts.created_at', 'posts.updated_at', 'posts.likes', 'posts.comments', 'likes.liked_by', "saved_posts.saved_by")
        ->orderBy('posts.created_at', 'DESC')
        ->orderBy('posts.updated_at', 'DESC')
        ->get();

        $posts = filterPosts($query, $user);
        
        return [ "status" => 200, "data" => $posts];
    }
    catch (Exception $err) {
        return ["status" => 404];
    }
    }

    public function getPostsByQuery(Request $request)
    {
        try {
        if ($request->query('query') != null) {
            $user = $request->user();

            $query = Post::select(
                'posts.*',
                'users.username',
                'users.picture',
                DB::raw('IF(likes.liked_by IS NOT NULL, TRUE, FALSE) as isLiked'),
                DB::raw('IF(saved_posts.saved_by IS NOT NULL, TRUE, FALSE) as isSaved')
            )
            ->where('posts.tags', 'like', '%' . $request->query('query') . '%')
            ->orWhere('posts.content', 'like', '%' . $request->query('query') . '%')
            ->join('users', 'users.userid', '=', 'posts.posted_by')
            ->leftJoin('likes', function($join) use ($user) {
                $join->on('posts.postid', '=', 'likes.postid')
                    ->where('likes.liked_by', '=', $user->userid);
            })
            ->leftJoin('saved_posts', function($join) use ($user) {
                $join->on('posts.postid', '=', 'saved_posts.postid')
                    ->where('saved_posts.saved_by', '=', $user->userid);
            })
            ->groupBy('posts.postid', 'users.username', 'users.picture', 'posts.id', 'posts.posted_by', 'posts.visibility', 'posts.tags', 'posts.content', 'posts.created_at', 'posts.updated_at', 'posts.likes', 'posts.comments', 'likes.liked_by', "saved_posts.saved_by")
            ->orderBy('posts.created_at', 'DESC')
            ->orderBy('posts.updated_at', 'DESC')
            ->get();

            $posts = filterPosts($query, $user);

            return [ "status" => 200, "data" => $posts];
        }

        return [ "status" => 200, "data" => []];
    }
    catch (Exception $err) {
        return ["status" => 404];
    }
    }

    public function getPostsByUser(Request $request)
    {
        try {
            
        $isUserValid = User::where('username', $request->username)->first();

        if (!$isUserValid) {
            return response()->json(['status' => 404]);
        }

        $user = $request->user();

        $query = Post::select(
            'posts.*',
            'users.username',
            'users.picture',
            DB::raw('IF(likes.liked_by IS NOT NULL, TRUE, FALSE) as isLiked'),
            DB::raw('IF(saved_posts.saved_by IS NOT NULL, TRUE, FALSE) as isSaved')
        )
        ->where('posts.posted_by', $isUserValid->userid)
        ->join('users', 'users.userid', '=', 'posts.posted_by')
        ->leftJoin('likes', function($join) use ($user) {
            $join->on('posts.postid', '=', 'likes.postid')
                ->where('likes.liked_by', '=', $user->userid);
        })
        ->leftJoin('saved_posts', function($join) use ($user) {
            $join->on('posts.postid', '=', 'saved_posts.postid')
                ->where('saved_posts.saved_by', '=', $user->userid);
        })
        ->groupBy('posts.postid', 'users.username', 'users.picture', 'posts.id', 'posts.posted_by', 'posts.visibility', 'posts.tags', 'posts.content', 'posts.created_at', 'posts.updated_at', 'posts.likes', 'posts.comments', 'likes.liked_by', "saved_posts.saved_by")
        ->orderBy('posts.created_at', 'DESC')
        ->orderBy('posts.updated_at', 'DESC')
        ->get();

        $posts = filterPosts($query, $user);

        return ["status" => 200, "data" => $posts];
        
        }
        catch (Exception $err) {
            return ["status" => 404];
        }
    }


    public function getPostsBySave(Request $request)
    {
        try {
        $user = $request->user();

        $query = SavedPost::where('saved_posts.saved_by', $user->userid)
        ->join('posts', 'posts.postid', '=', 'saved_posts.postid')
        ->select(
            'posts.*',
            'users.username',
            'users.picture',
            DB::raw('IF(likes.liked_by IS NOT NULL, TRUE, FALSE) as isLiked'),
            DB::raw('IF(saved_posts.saved_by IS NOT NULL, TRUE, FALSE) as isSaved')
        )
        ->join('users', 'users.userid', '=', 'posts.posted_by')
        ->leftJoin('likes', function($join) use ($user) {
            $join->on('posts.postid', '=', 'likes.postid')
                ->where('likes.liked_by', '=', $user->userid);
        })
        ->groupBy('posts.postid', 'users.username', 'users.picture', 'posts.id', 'posts.posted_by', 'posts.visibility', 'posts.tags', 'posts.content', 'posts.created_at', 'posts.updated_at', 'posts.likes', 'posts.comments', 'likes.liked_by', "saved_posts.saved_by")
        ->orderBy('posts.created_at', 'DESC')
        ->orderBy('posts.updated_at', 'DESC')
        ->get();

        $posts = filterPosts($query, $user);

        return ["status" => 200, "data" => $posts];
        }
        catch (Exception $err) {
            return ["status" => 404];
        }
    }



    public function likePost(Request $request) {
        try {
            $postId = $request->postid;
            $user = $request->user();
            $liked = Like::where('postid', $postId)->where('liked_by', $user->userid)->first();
            $post = Post::where('postid', $postId)->first();
            $like = false;
            
            if ($liked) {
                $liked->delete();
                $post->decrement('likes');
                Notification::where(
                    'like_reaction_id', $liked->reaction_id
                )->delete();
            } else {
                $reaction_id = "like_" . Str::random(50);
                Like::create([
                    'reaction_id' => $reaction_id,
                    'postid' => $postId,
                    'liked_by' => $user->userid,
                ]);
                $post->increment('likes');

                if ($post->posted_by != $user->userid) {
                    Notification::create([
                        "like_reaction_id" => $reaction_id,
                        "reacted_to" => $post->posted_by,
                        "reacted_by" => $user->userid,
                        "type" => "like"
                    ]);
                }

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

            $validator = Validator::make($request->all(), [
                'postid' => ['required', 'starts_with:post_'],
                'content' => ['required'],
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 404, 'data' => $validator->messages()], 404);
            }

            $reaction_id = "comment_" . Str::random(50);

            $comment = Comment::create([
                'reaction_id' => $reaction_id,
                'postid' => $postId,
                'commented_by' => $user->userid,
                'content' => $request->content,
            ]);

            if ($post->posted_by != $user->userid) {
                Notification::create([
                    'comment_reaction_id' => $reaction_id,
                    "reacted_to" => $post->posted_by,
                    "reacted_by" => $user->userid,
                    "type" => "comment"
                ]);
            }

            $post->increment('comments');
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


function filterPosts ($posts, $user) {
    return $posts->filter(function($post) use ($user) {
        return $post->visibility === "public" || $post->posted_by === $user->userid;
    })
    ->map(function($post) use ($user) {
        $post->formatted_created_at = Carbon::parse($post->created_at)->toDayDateTimeString();
        $post->age = Carbon::parse($post->created_at)->diffForHumans();
        $post->owner = $post->posted_by == $user->userid;
        return $post;
    })
    ->values()
    ->toArray();
}