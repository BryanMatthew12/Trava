<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;
use App\Models\User;

class Threads extends Model
{
    use HasFactory;

    protected $primaryKey = 'threadId';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id'); // Only user owns the thread
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'thread_id', 'thread_id');
    }
}
