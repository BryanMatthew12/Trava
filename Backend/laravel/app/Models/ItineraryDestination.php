<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItineraryDestination extends Model
{
    use HasFactory;

    protected $fillable = [
        'itinerary_id',
        'place_id'
        'destination_id',
        'destination_name',
        'visit_order',
        'est_price', 
    ];

    // One itineraryDestination belongs to one itinerary
    public function itinerary()
    {
        return $this->belongsTo(Itinerary::class, 'itinerary_id', 'id');
    }

    // One itineraryDestination references one place
    public function place()
    {
        return $this->belongsTo(Places::class, 'place_id', 'id');
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id', 'id');
    }
    
}
