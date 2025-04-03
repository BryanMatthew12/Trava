<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    /** @use HasFactory<\Database\Factories\AdminFactory> */
    use HasFactory;

    protected $primaryKey = 'adminId'; // Explicit primary key
    protected $fillable = ['adminId', 'userId', 'adminPermissions'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'userId');
    }

    public function threads()
    {
        return $this->hasMany(Thread::class, 'adminId', 'adminId');
    }
}
