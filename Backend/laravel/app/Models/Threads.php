<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Threads extends Model
{
    /** @use HasFactory<\Database\Factories\ThreadsFactory> */
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'userId');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'adminId', 'adminId');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'threadId', 'threadId');
    }

    
}
