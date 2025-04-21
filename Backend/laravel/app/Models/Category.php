<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id';


    protected $fillable = [
        'name'
    ];

    
    public function userPreferences()
    {
        return $this->hasMany(UserPreference::class);
    }

    public function places()
    {
        return $this->belongsToMany(Places::class, 'category_place', 'category_id', 'place_id');
    }
}
