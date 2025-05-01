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

    protected $primaryKey = 'place_id';

    protected $fillable = [
        'destination_id',
        'location_id',
        'place_name',
        'place_description',
        'place_rating',
        'place_picture',
        'place_est_price',
        'views'
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id', 'destination_id');
    }

    public function itineraryDestinations()
    {
        return $this->hasMany(ItineraryDestination::class, 'place_id', 'place_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_place', 'place_id', 'category_id');
    }
    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id', 'location_id');
    }
}
