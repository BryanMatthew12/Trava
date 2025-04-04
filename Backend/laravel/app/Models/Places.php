<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Places extends Model
{
    /** @use HasFactory<\Database\Factories\PlacesFactory> */
    use HasFactory;

    protected $primaryKey = 'places_id';

    protected $fillable = [
        'place_id',
        'destination_id',
        'place_name',
        'description',
        'location',
        'place_rating',
        'place_picture',
        'place_est_price'
    ]

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id');
    }

    public function itineraryDestinations()
    {
        return $this->hasMany(ItineraryDestination::class, 'place_id', 'id');
    }
}
