<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Admin;
use App\Models\Itinerary;
use App\Models\Threads;
use App\Models\Comment;

class User extends Model
{

    use HasFactory;

    protected $table = 'users'; // Explicitly define table name
    protected $primaryKey = 'user_id'; // Set custom primary key
    public $incrementing = true; // Ensure auto-increment
    protected $keyType = 'integer'; // Match bigIncrements() type 

    protected $fillable = [
        'user_id', 
        'user_name',
        'user_email', 
        'user_password', 
        'role'
    ];

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'user_id', 'user_id');
    }

    public function itineraries() {
        return $this->hasMany(Itinerary::class, 'user_id', 'user_id');
    }

    public function threads()
    {
        return $this->hasMany(Threads::class, 'user_id', 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

}
