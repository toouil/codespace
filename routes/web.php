<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::middleware('auth')->group(function () {
    Route::controller(PostController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/search', 'renderPostsByQuery')->name('search');
        Route::get('/tag/{tag}', 'renderPostsByTag')->name('posts.byTag');
        Route::get('/savedposts', 'renderPostsBySave')->name('posts.bySave');
        Route::post('/addpost', 'addPost')->name('post.add');
        Route::post('/deletepost', 'deletePost')->name('post.delete');
        Route::post('/savepost', 'savePost')->name('post.save');
        Route::post('/like', 'likePost')->name('post.like');
        Route::post('/comment', 'commentPost')->name('post.addcomment');
        Route::get('/comments', 'getPostComments')->name('post.getcomments');

        Route::get('/api/posts', 'getAllPosts')->name('post.apiAll');
        Route::get('/api/postsTag', 'getPostsByTag')->name('post.apiTag');
        Route::get('/api/postsQuery', 'getPostsByQuery')->name('post.apiQuery');
        Route::get('/api/postsUser', 'getPostsByUser')->name('post.apiUser');
        Route::get('/api/postsSave', 'getPostsBySave')->name('post.apiSave');
    });
});

Route::middleware('auth')->group(function () {
    Route::controller(AssignmentController::class)->group(function () {
        Route::get('/categories', 'getCategories')->name('categories');
        Route::get('/categories/{category}', 'getAssignmentsByCategory')->name('assignments');
    });
});

Route::middleware('auth')->group(function () {
    Route::controller(ScoreController::class)->group(function () {
        Route::get('/Leaderboard', 'showScores')->name('scores.show');
        Route::get('/scores', 'getScores')->name('scores.get');
        Route::post('/score', 'storeScore')->name('scores.store');
    });
});

Route::middleware('auth')->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::get('/users', 'getUsers')->name('users.get');
    });
});

Route::middleware('auth')->group(function () {
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/authuserprofile', 'authuserprofile')->name("profile.authuser");
        Route::get('/profile/{username}', 'profile')->name('profile');
    });
});

Route::middleware('auth')->group(function () {
    Route::controller(SettingsController::class)->group(function () {
        Route::redirect('/settings', '/settings/profile');
        Route::get('/settings/profile', 'profileSettings')->name("settings.profile");
        Route::get('/settings/account', 'accountSettings')->name("settings.account");

        Route::post('/settings/edit/username', 'updateAccountUsername')->name("update.username");
        Route::post('/settings/edit/picture', 'updateAccountPicture')->name("update.picture");
        Route::post('/settings/edit/profile', 'updateProfile')->name("update.profile");
        Route::post('/settings/delete/user', 'deleteAccount')->name("delete.account");
    });
});

Route::middleware('auth')->group(function () {
    Route::controller(NotificationController::class)->group(function () {
        Route::get('/notifications', 'notifications')->name("notifications");
    });
});

require("auth.php");