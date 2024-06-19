<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Assignment;
use App\Models\Category;
use App\Models\Score;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function storeNewAssignment (Request $request) {
        try {
            $assignmentId = "assignment_".Str::random(30);

            $setAssignment = Assignment::create([
                "assignmentid" => $assignmentId,
                "score" => $request->score,
                "question" => $request->question,
                "category" => $request->category,
                "code" => $request->code
            ]);
            
            if ($setAssignment) {
                $answers = $request->answers;
                
                foreach ($answers as $answer) {
                    $answer['assignmentId'] = $assignmentId;
                }
                
                $setAnswers = Answer::insert($answers);

                if ($setAnswers) {
                    return response()->json([ "status" => 200, "message" => "Assignment added"]);
                }
            }
        } catch (Exception $err) {
            return response()->json([ "status" => 404, "message" => $err]);
        }
    }


    public function getAssignmentsByCategory (Request $request) {
        try {
            $assignments = Assignment::with(['answers' => function ($query) {
                $query->inRandomOrder();
            }])->where('category', $request->category)->inRandomOrder()->limit(15)->get();
            $sum_assignments = $assignments->sum("score");

            return Inertia::render('Assignments/Assignments', ['assignments' => $assignments, "category" => $request->category, "sumScores" => $sum_assignments]);
        } catch (Exception $err) {
            return response()->json([ "status" => 404, "message" => "Something wrong !!"]);
        }
    }

    public function setCategory (Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                "name" => ["required", "string", "unique:categories"],
                "logo" => ["required", "url"],
                "badge" => ["required", "url"],
            ]);

            if ($validator->fails()) {
                return response()->json([ "status" => 404, "message" => $validator->messages()]);
            }
            
            Category::create([
                "name" => $request->name,
                "logo" => $request->logo,
                "badge" => $request->badge,
                "profile_badge" => $request->profile_badge,
            ]);
            
            return response()->json([ "status" => 200, "message" => "$request->name added"]);
        } catch (Exception $err) {
            return response()->json([ "status" => 404, "message" => $err]);
        }
    }

    public function getCategories (Request $request) {
        try {
            $categories = Category::select("name", "logo")->get();
            return Inertia::render('Assignments/Categories', ['categories' => $categories]);
        } catch (Exception $err) {
            return response()->json([ "status" => 404, "error" => $err]);
        }
    }
}
