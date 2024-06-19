<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function authuserprofile(Request $request) {
        $userid = $request->user()->userid;
        $userprofile = User::where("userid", $userid)->with("profile")->first();

        return $userprofile;
    }

    public function profile(Request $request)
    {
        try {
            $PostController = new PostController();

            $user = User::with([
                'profile',
                'scores' => function($query) {
                    $query->where('passed', true)->with('category');
                }
            ])->where('username', $request->username)->first();
            $user->formatted_created_at  = Carbon::parse($user->created_at)->toDayDateTimeString();
            $user->posts = $PostController->getPostsByUser($request);
    
            return Inertia::render('Profile/Profile', [ "user" => $user ]);
        }
        catch (Exception $err) {
            return Inertia::render('Profile/Profile', [ "user" => null ]);
        }
    }
}
