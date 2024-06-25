<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SettingsController extends Controller
{
    public function profileSettings (Request $request) {
        $profileController = new ProfileController();
        $profile = $profileController->authuserprofile($request);

        return Inertia::render('Settings/Profile', ["profile" => $profile])
        ->withViewData([
            "title" => "Profile settings | CodeSpace",
            "description" => "Edite your profile settings",
            "keywords" => "profile, profile settings"
        ]);
    }

    public function accountSettings (Request $request) {
        return Inertia::render('Settings/Account')
        ->withViewData([
            "title" => "Account settings | CodeSpace",
            "description" => "Edite your account settings",
            "keywords" => "Account, Account settings"
        ]);
    }
    
    public function updateProfile (Request $request) {
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
                return response()->json([ "status" => 404, "error" => $validator->messages()]); 
            }
            
            Profile::updateOrCreate(['userid' => $request->user()->userid], $request->all());

            return response()->json([ "status" => 200 ]);
        } catch (Exception $err) {
            return response()->json([ "status" => 404, "error" => ["e" => "Something wrong !! .. please try later"] ]);
        }
    }

    public function updateAccountPicture (Request $request) {
        try {
            $folderName = "user_profile_picture";
            $request->validate([
                'picture' => 'required|image|mimes:jpeg,png,jpg',
            ]);

            $picture = $request->file("picture");
            if ($picture) {
                $name = $request->user()->username."_".time(). Str::random(20) .".".$picture->extension();
                
                $picture->move(public_path($folderName) , $name);
                $path = env("STORAGE_ROOT", "/public") . "/" . $folderName . "/" . $name;

                if ($path) {
                    $user = $request->user();
                    $user->picture = $path;
                    $user->save();

                    return back();
                }
            }
    
            throw new Exception(json_encode(["message" => "Something wrong .. please try later"]));
        }
        catch(Exception $err) {
            return response($err->getMessage());
        }
    }

    public function updateAccountUsername (Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'unique:users', 'min:3', 'max:50', 'regex:/^[a-zA-Z0-9_]+$/'],
        ]);

        if ($validator->fails()) {
            return response()->json([ "status" => 404, "error" => $validator->messages()]);
        }

    
        $request->user()->update([
            "username" => $request->username
        ]);

        return response()->json([ "status"=> 200 ]);
    }

    public function deleteAccount(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
