<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Places extends Model
{
    /** @use HasFactory<\Database\Factories\PlacesFactory> */
    use HasFactory;

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id');
    }

    public function itineraryDestinations()
    {
        return $this->hasMany(ItineraryDestination::class, 'place_id', 'id');
    }
}
