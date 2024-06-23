<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                if ($user->google_id == $googleUser->id) {
                    Auth::login($user, true);
                    return redirect( route("index") );
                }

                return redirect("/login")->with("error", "The account containing this email is already locked with a password !");
            }

            $user = User::create([
                'username' => formatUsername($googleUser->name),
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'picture' => $googleUser->avatar,
                'password' => Hash::make(Str::random(24))
            ]);

            Auth::login($user, true);
            return redirect( route("index") );
        }
        catch (Exception $err) {
            return redirect("/login")->with("error", "Something went wrong .. please try later !!");
        }
    }
}

function formatUsername ($input) {
    return preg_replace('/\s+/', '_', preg_replace('/[^a-z0-9 ]/', '', strtolower($input))) . "_" . strtolower(Str::random(5));
}