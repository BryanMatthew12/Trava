<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Places;
use App\Models\Itinerary;
use App\Models\ItineraryDestination;


class Destination extends Model
{
    /** @use HasFactory<\Database\Factories\DestinationFactory> */
    use HasFactory;

    protected $primaryKey = 'destination_id';

    protected $fillable = [
        'itinerary_id',
        'description',
        'picture',
        'location',
    ];

    public function places()
    {
        return $this->hasMany(Places::class, 'destination_id', 'destination_id');
    }

    public function itineraries()
    {
        return $this->belongsToMany(Itinerary::class, 'destination_itinerary', 'destination_id', 'itinerary_id');
    }

    public function itineraryDestinations()
    {
        return $this->hasMany(ItineraryDestination::class, 'destination_id', 'destination_id');
    }
}
