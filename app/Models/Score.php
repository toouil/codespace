<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    use HasFactory;

    protected $fillable = [
        'userid',
        'category',
        'score',
        'passed'
    ];

    protected $hidden = [
        'userid'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category', 'name');
    }
}
