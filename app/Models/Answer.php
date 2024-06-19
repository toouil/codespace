<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignmentid',
        'answer',
        'correct'
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'assignmentid', 'assignmentid');
    }

}
