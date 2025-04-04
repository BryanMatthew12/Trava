<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    /** @use HasFactory<\Database\Factories\DestinationFactory> */
    use HasFactory;

    public function places()
    {
        return $this->hasMany(Places::class, 'destination_id', 'id');
    }

    public function itineraries()
    {
        return $this->belongsToMany(Itinerary::class, 'destination_itinerary', 'destination_id', 'itinerary_id');
    }
}
