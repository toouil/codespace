<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    
    public $fillable = [
        "like_reaction_id",
        "comment_reaction_id",
        "reacted_by",
        "reacted_to",
        "type",
        "read"
    ];
}
