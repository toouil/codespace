<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
        'badge',
        'profile_badge'
    ];

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'name', 'category');
    }
    public function scores()
    {
        return $this->hasMany(Score::class, 'name', 'category');
    }
}
