<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'picture',
        'provider',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->userid = Str::uuid();
            $model->picture = env("STORAGE_ROOT", "/public") . "/user_profile_picture/profile_picture.png";
        });
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile () {
        return $this->hasOne(Profile::class , 'userid', 'userid');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'posted_by', 'userid');
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'userid', 'userid');
    }

}
