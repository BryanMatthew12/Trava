<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Admin;
use App\Models\Itinerary;
use App\Models\Threads;
use App\Models\Comment;

class User extends Authenticatable implements JWTSubject
{

    use HasFactory;

    protected $table = 'users'; // Explicitly define table name
    protected $primaryKey = 'user_id'; // Set custom primary key
    public $incrementing = true; // Ensure auto-increment
    protected $keyType = 'integer'; // Match bigIncrements() type 

    protected $fillable = [
        'user_id', 
        'username',
        'email', 
        'password', 
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
        return $this->hasMany(Comment::class, 'user_id', 'user_id');
    }

    public function preferences()
    {
        return $this->hasMany(UserPreference::class, 'user_id', 'user_id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey(); // Return the primary key
    }

    public function getJWTCustomClaims()
    {
        return [
            'username' => $this->username,
            'email' => $this->email,
            'role' => $this->role,
        ]; // Add any custom claims if needed
    }
}
