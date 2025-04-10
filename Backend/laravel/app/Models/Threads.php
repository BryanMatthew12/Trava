<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;
use App\Models\User;
use App\Models\Itinerary;

class Threads extends Model
{
    use HasFactory;

    protected $primaryKey = 'thread_id';

    protected $fillable = [
        'user_id',
        'itinerary_id',
        'views',
        'likes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id'); // Only user owns the thread
    }

    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class, 'itinerary_id', 'itinerary_id'); // Only itinerary owns the thread
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'thread_id', 'thread_id');
    }
}
