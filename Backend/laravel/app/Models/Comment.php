<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Threads;
use App\Models\User;


class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory;


    protected $fillable = [
        'user_id',
        'thread_id',
        'content',
    ];

    public function thread()
    {
        return $this->belongsTo(Threads::class, 'thread_id', 'thread_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id'); 
    }
}
