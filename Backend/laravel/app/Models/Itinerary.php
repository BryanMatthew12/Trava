<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Itinerary extends Model
{
    /** @use HasFactory<\Database\Factories\ItineraryFactory> */
    use HasFactory;

    public function user() {
        return $this->belongsTo(User::class, 'userId');
    }

    public function days()
    {
        return $this->hasMany(Day::class, 'dayId', 'dayId');
    }

    public function destinations()
    {
        return $this->belongsToMany(Destination::class, 'itineraryId', 'destinationId');
    }

}
