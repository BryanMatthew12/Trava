<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Day;
use App\Http\Requests\StoreDayRequest;
use App\Http\Requests\UpdateDayRequest;
use App\Http\Controllers\Controller;

class DayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Day::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDayRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Day $day)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Day $day)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDayRequest $request, Day $day)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Day $day)
    {
        //
    }

    public function getDaysByItinerary($itinerary_id)
    {
        $days = Day::where('itinerary_id', $itinerary_id)->get();

        return response()->json($days);
    }
}
