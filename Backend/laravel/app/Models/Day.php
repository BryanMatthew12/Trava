<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Day extends Model
{

    use HasFactory;

    protected $fillable = [
        'day_id',
        'itinerary_id',
        'day_number',
        // 'places' ??
    ]

    public function itinerary()
    {
        return $this->belongsTo(itinerary::class, 'itineraryId', 'itineraryId');
    }

}
