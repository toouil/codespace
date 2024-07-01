<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Category;
use App\Models\Score;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ScoreController extends Controller
{
    public function showScores (Request $request) {
        try {
            $categories = Category::get();
            return Inertia::render('Leaderboard/Leaderboard', [ "categories" => $categories ])
            ->withViewData([
                "title" => "Leaderboard | CodeSpace",
                "description" => "See others users's scores and rank",
                "keywords" => "scores, Leaderboard"
            ]);
        } catch (Exception $err) {
            return Inertia::render('Leaderboard/Leaderboard', [ "categories" => [] ])
            ->withViewData([
                "title" => "Leaderboard | CodeSpace",
                "description" => "See others users's scores and rank",
                "keywords" => "scores, Leaderboard"
            ]);
        }
    }

    public function getScores (Request $request) {
        try {
            $scores = DB::table('scores')
            ->join('users', 'scores.userid', '=', 'users.userid')
            ->where('scores.category', $request->category)
            ->select('scores.*', 'users.username', 'users.picture')
            ->selectRaw('(@rank := @rank + 1) AS rank')
            ->crossJoin(DB::raw('(SELECT @rank := 0) as r'))
            ->orderBy('scores.score', 'DESC')
            ->orderBy('scores.id', 'ASC')
            ->get();

            // $scores = Score::select('scores.*', 'users.username', 'users.picture')
            // ->where('category' , $request->category)
            // ->join('users' , 'scores.userid', '=', 'users.userid')
            // ->selectRaw('RANK() OVER (ORDER BY score DESC, id ASC) as rank')
            // ->get();

            $userscore = $scores->where('userid', $request->user()->userid)->first();
            return response()->json([ "status" => 200, "data" => [ "scores" => $scores, "userscore" => $userscore ] ]);
        } catch (Exception $err) {
            return response()->json([ "status" => 200, "message" => $err]);
        }
    }

    public function storeScore (Request $request) {
        try {
            $category = $request->category;
            $answers = $request->answers;
            $user = $request->user();

            $getAnswersDetails = Answer::whereIn('id', $answers)
                    ->with('assignment')
                    ->get()->map(function ($answer) {
                        return [
                            'id' => $answer->id,
                            'assignmentid' => $answer->assignmentid,
                            'correct' => $answer->correct,
                            'answer' => $answer->answer,
                            'score' => $answer->assignment->score,
                        ];
                    });

            $getAnswersSumScore = $getAnswersDetails->sum("score");
            $getCorrectAnswersSumScore = $getAnswersDetails->where("correct", true)->sum("score");

            $isPassed = ($getCorrectAnswersSumScore / $getAnswersSumScore) * 100 > 80;

            $score = $user->where("category", $category)->join('categories', 'categories.name', '=', 'scores.category')->first();

            if ($score) {
                if ($getCorrectAnswersSumScore > $score->score) {
                    $user->where("category", $category)->update([
                        "score" => $getCorrectAnswersSumScore,
                        "passed" => $score->passed || $isPassed
                    ]);
    
                    $score["oldscore"] = $score->score;
                    $score["score"] = $getCorrectAnswersSumScore;
                    $score["passed"] = $score->passed ?? $isPassed;
                    $score["message"] = "Your score has been updated";
                    $score["action"] = "update";
    
                    return response()->json([ "status" => 200, "data" => $score]);
                } else if ($request->score <= $score->score) {
                    $score["message"] = "Your old score already better";
                    $score["action"] = "none";
                    return response()->json([ "status" => 200, "data" => $score]);
                }
            }

            $userScore = $user->create([
                "userid" => $user->userid,
                "category" => $category,
                "score" => $getCorrectAnswersSumScore,
                "passed" => $isPassed
            ]);

            if ($userScore) {
                $categoryDetails = Category::where("name", $category)->first();
                $userScore["message"] = "Your score has been saved";
                $userScore["action"] = "save";

                $response = array_merge(
                    $userScore->toArray(),
                    $categoryDetails->toArray()
                );

                return response()->json([ "status" => 200, "data" => $response,]);
            }
        } catch (Exception $err) {
            return response()->json([ "status" => 404, "message" => $err]);
        }
    }
}
