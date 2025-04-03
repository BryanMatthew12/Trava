<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{

    use HasFactory;

    protected $table = 'users'; // Explicitly define table name
    protected $primaryKey = 'userId'; // Set custom primary key
    public $incrementing = true; // Ensure auto-increment
    protected $keyType = 'bigint'; // Match bigIncrements() type 
    protected $fillable = ['userId', 'userName', 'userEmail', 'userPassword', 'role'];

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'userId', 'userId');
    }

    public function itineraries() {
        return $this->hasMany(Itinerary::class, 'userId', 'userId');
    }

    public function threads()
    {
        return $this->hasMany(Thread::class, 'userId', 'userId');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

}
