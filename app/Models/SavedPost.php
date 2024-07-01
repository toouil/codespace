<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedPost extends Model
{
    use HasFactory;

    protected $fillable = [
        "saved_by",
        "postid"
    ];

    public function post () {
        return $this->belongsTo(Post::class, 'postid', 'postid');
    }

    public function user () {
        return $this->belongsTo(User::class, 'saved_by', 'userid');
    }
}
