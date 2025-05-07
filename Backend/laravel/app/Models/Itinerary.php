<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Day;
use App\Models\Destination;
use App\Models\Threads;


class Itinerary extends Model
{
    /** @use HasFactory<\Database\Factories\ItineraryFactory> */
    use HasFactory;
    
    protected $primaryKey = 'itinerary_id';

    protected $fillable = [
        'user_id',
        'start_date',
        'end_date',
        'budget',
        'itinerary_description',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id'); 
    }

    public function days()
    {
        return $this->hasMany(Day::class, 'itinerary_id', 'itinerary_id');
    }

    public function destinations()
    {
        return $this->belongsToMany(Destination::class, 'destination_itinerary', 'itinerary_id', 'destination_id');
    }

    public function thread()
    {
        return $this->hasOne(Threads::class, 'itinerary_id', 'itinerary_id');
    }

    public function itineraryDestinations()
    {
        return $this->hasMany(ItineraryDestination::class, 'itinerary_id', 'itinerary_id');
    }

}
