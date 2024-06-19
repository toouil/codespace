<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'userid',
        'bio',
        'instagram',
        'linkedin',
        'github',
        'website',
        'country'
    ];

    protected $hidden = [
        'userid',
    ];

    public $timestamps = false;

    public function user () {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }
}
