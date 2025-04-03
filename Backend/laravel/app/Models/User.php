<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    protected $primaryKey = 'userId'; // Explicitly define primary key
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



}
