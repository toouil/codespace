<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Profile;
use App\Models\Score;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    public function getUsers (Request $request) {
        try {
            $query = $request->query("query");

            if ($query == null) {
                $users = User::inRandomOrder()->limit(20)->get();
                return Inertia::render("User/Users", [ "status" => 200, "users" => $users])
                ->withViewData([
                    "title" => "Users | CodeSpace",
                    "description" => "See users",
                    "keywords" => "users, friends"
                ]);
            }
            
            $users = User::where('username', 'like', '%'.$request->query("query").'%')->get();
            return Inertia::render("User/Users", [ "status" => 200, "users" => $users, "userquery" =>$request->query("query")])
            ->withViewData([
                "title" => $request->query("query") . " users search results | CodeSpace",
                "description" => "Find users by name : " . $request->query("query"),
                "keywords" => "users, friends"
            ]);

        } catch (Exception $err) {
            return response()->json([ "status" => 404, "message" => $err->getMessage()]);
        }
    }
}
