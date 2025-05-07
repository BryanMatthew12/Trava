<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Itinerary;


class Day extends Model
{

    use HasFactory;

    protected $primaryKey = 'day_id';

    protected $fillable = [
        'itinerary_id',
        'day_number',

    ];

    public function itinerary()
    {
        return $this->belongsTo(itinerary::class, 'itinerary_id', 'itinerary_id');
    }

    public function itineraryDestinations()
    {
        return $this->hasMany(ItineraryDestination::class, 'day_id', 'day_id');
    }

}
