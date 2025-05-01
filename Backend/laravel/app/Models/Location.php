<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;


    protected $primaryKey = 'location_id'; // Since we used a custom primary key.
    public $timestamps = true;

    protected $fillable = [
        'location_name',
        'latitude',
        'longitude',
    ];
    
    public function places()
    {
        return $this->hasMany(Places::class, 'location_id', 'location_id');
    }

}
