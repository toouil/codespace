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

    public function userProfile (Request $request) {
        try {
            $user = User::where('username', $request->username)
            ->leftJoin('profiles', 'profiles.userid', '=', 'users.userid')
            ->first(['users.created_at AS u_created_at', "users.userid AS u_userid", "users.*", 'profiles.*']);
    
            if ($user) {
                $userBadges = Score::where('passed', true)
                ->where('userid', $user["u_userid"])
                ->join('categories', 'categories.name', '=', 'scores.category')
                ->get();
    
                $isUser = $request->userid == $user->u_userid;
    
                return response()->json([ "status" => 200, "data" => [ "user" => $user, "badges" => $userBadges, "isUser" => $isUser ]]);
            }
    
            else {
                return response()->json([ "status" => 404 ]);
            }
        }
        catch (Exception $err) {
            return response()->json([ "status" => 404 ]);
        }
    }

    public function getuserProfile_sett (Request $request) {
        $user = Profile::where('userid', $request->userid)->first();

        if ($user) {
            return response()->json([ "status" => 200, "data" => $user]);
        }
    }

    public function setProfileInfo (Request $request) {
        try {
            $rules = [
                'bio' => ['nullable', 'string'],
                'instagram' => ['nullable', 'regex:/^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_]+\/?$/i'],
                'github' => ['nullable', 'regex:/^https?:\/\/github\.com\/[\w-]+\/?$/i'],
                'linkedin' => ['nullable', 'regex:/^https?:\/\/www\.linkedin\.com\/in\/[\w-]+\/?$/i'],
                'website' => ['nullable', 'url'],
                'country' => ['nullable', 'string'],
            ];
            
            $validator = Validator::make($request->all(), $rules);
            
            if ($validator->fails()) {
                return response()->json([ "status" => 404, "data" => $validator->messages()]); 
            }
            
            
            Profile::updateOrCreate(['userid' => $request->userid], $request->all());
            return response()->json([ "status" => 200 ]);
        } catch (Exception $err) {
            return response()->json([ "status" => 404 ]);
        }
    }

    public function editUsername (Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'unique:users', 'min:6', 'max:50', 'regex:/^[a-zA-Z0-9_]+$/'],
        ]);

        if ($validator->fails()) {
            return response()->json([ "status" => 404, "data" => $validator->messages()]);
        }

        User::where('userid', $request->userid)
        ->update([
            "username" => $request->username
        ]);

        return response()->json([ "status" => 200 ]);
    }

    public function changePassword (Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                "password" => ["required"],
                "newpassword" => ["required", "min:8"],
                "c_newpassword" => ["required", "same:newpassword"]
            ]);
    
            if ($validator->fails()) {
                return response()->json([ "status" => 404, "data" => $validator->messages()]);
            }
    
            $user = User::where('userid', $request->userid)->first();
            if ($user && $user->provider == "codespace") {
                $checkPass = Hash::check($request["password"], $user["password"]);
                if ($checkPass) {
                    $user->update([
                        "password" => Hash::make($request["newpassword"])
                    ]);
    
                    return response()->json([ "status" => 200 ]);
                }
    
                else {
                    return response()->json([ "status" => 404, "data" => [ "password" => ["Password incorrect .. try again"] ] ]);
                }
            }
        }
        catch (Exception $err) {
            return response()->json([ "status" => 404, "data" => [ "password" => ["Somthing wrong .. please try later"] ] ]);
        }
    }

    public function deleteAccount (Request $request) {
        try {
            User::where('userid', $request->userid)->delete();
            return response()->json([ "status" => 200]);
        } catch (Exception $err) {
            return response()->json([ "status" => 404]);
        }
    }
}
