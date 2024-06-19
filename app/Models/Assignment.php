<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignmentid',
        'score',
        'question',
        'category',
        'code'
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class, 'assignmentid', 'assignmentid');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category', 'name');
    }
}
