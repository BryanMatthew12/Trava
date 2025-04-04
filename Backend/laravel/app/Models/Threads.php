<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Threads extends Model
{
    use HasFactory;

    protected $primaryKey = 'threadId';

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'userId'); // Only user owns the thread
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'threadId', 'threadId');
    }
}
