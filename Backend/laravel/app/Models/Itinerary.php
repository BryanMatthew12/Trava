<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Itinerary extends Model
{
    /** @use HasFactory<\Database\Factories\ItineraryFactory> */
    use HasFactory;
    
    protected $primaryKey = 'itinerary_id';

    protected $fillable = [
        'itinerary_id',
        'user_id',
        'start_date',
        'end_date',
        'days',
        'budget',
        'itinerary_description',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function days()
    {
        return $this->hasMany(Day::class, 'itineraryId', 'itineraryId');
    }

    public function destinations()
    {
        return $this->belongsToMany(Destination::class, 'destination_itinerary', 'itinerary_id', 'destination_id');
    }

}
