<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    
    public function userPreferences()
    {
        return $this->hasMany(UserPreference::class);
    }

    public function places()
    {
        return $this->hasMany(Places::class, 'category_id', 'id');
    }
}
