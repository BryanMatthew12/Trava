<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Itinerary;
use App\Models\Places;
use App\Models\Day;
use App\Models\Destination;

class ItineraryDestination extends Model
{
    use HasFactory;

    protected $fillable = [
        'itinerary_id',
        'place_id',
        'day_id',
        'destination_id',
        'place_name',
        'visit_order',
        'est_price', 
    ];

    // One itineraryDestination belongs to one itinerary
    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class, 'itinerary_id', 'itinerary_id');
    }

    // One itineraryDestination references one place
    public function place()
    {
        return $this->belongsTo(Places::class, 'place_id', 'place_id');
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id', 'destination_id');
    }

    public function day()
    {
        return $this->belongsTo(Day::class, 'day_id', 'day_id');
    }
    

}
