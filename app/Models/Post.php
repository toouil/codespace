<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    public $fillable = [
        "postid",
        "posted_by",
        "visibility",
        "tags",
        "content",
        "likes",
        "comments",
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->postid = "post_".Str::random(50);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'posted_by');
    }
}
