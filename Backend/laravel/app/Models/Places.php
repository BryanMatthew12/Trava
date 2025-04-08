<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ItineraryDestination;
use App\Models\Destination;

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
        'category',
        'place_rating',
        'place_picture',
        'place_est_price'
    ];

    public function destination()
    {
<<<<<<< HEAD
        return $this->belongsTo(Destination::class, 'destination_id, destination_id');
=======
        return $this->belongsTo(Destination::class, 'destination_id', 'destination_id');
>>>>>>> c96ea809b3bb206c377bbd87e0f9c8c70f558192
    }

    public function itineraryDestinations()
    {
        return $this->hasMany(ItineraryDestination::class, 'place_id', 'place_id');
    }
}
