<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Itinerary;
use App\Models\Destination;
use App\Http\Requests\StoreItineraryRequest;
use App\Http\Requests\UpdateItineraryRequest;
use App\Http\Controllers\Controller;
use App\Models\Day;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ItineraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    // Check if the 'itinerary_id' or 'user_id' query parameter is present
    $itineraryId = request()->query('itinerary_id');
    $userId = request()->query('user_id');

    if ($itineraryId) {
        // Filter itineraries by itinerary_id if the parameter is provided
        $itinerary = Itinerary::where('itinerary_id', $itineraryId)->first();
    } elseif ($userId) {
        // Filter itineraries by user_id if the parameter is provided
        $itinerary = Itinerary::where('user_id', $userId)->get();
    } else {
        // Return all itineraries if no parameters are provided
        $itinerary = Itinerary::all();
    }

    return response()->json($itinerary);
}

    /**
     * Display the specified resource.
     */
    public function show($itinerary_id)
    {
        $itinerary = Itinerary::with('destinations')->find($itinerary_id);

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found.'], 404);
        }
    
        return response()->json([
            'start_date' => $itinerary->start_date,
            'end_date' => $itinerary->end_date,
            'budget' => $itinerary->budget,
            'itinerary_description' => $itinerary->itinerary_description,
            'destination_name' => $itinerary->destinations->pluck('destination_name')->first(), // assuming 1 destination
        ], 200);
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
    public function store(StoreItineraryRequest $request)
    {
        // $user = auth('api')->user();

        // if (!$user) {
        //     return response()->json(['message' => 'Unauthorized'], 401);
        // }

        // if ($user->role !== 'user') {
        //     return response()->json(['message' => 'Forbidden - Only user can access'], 403);
        // }
        // dd(Auth::user()->role);

        // if (Auth::user()->role != 'user' && Auth::user()->role != 1) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        // Validate Request
        $validated = $request->validated();

        // Calculate days using start and end date
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        

        Log::info('Start Date: ' . $startDate);
        Log::info('End Date: ' . $endDate);
        
        // if ($startDate > $endDate) {
        //     return response()->json(['message' => 'Start date cannot be later than end date'], 400);
        // }
        $days = $startDate->diffInDays($endDate) +1;

        Log::info('Days: ' . $days);

        // Create the itinerary with calulcated days
        $itinerary = Itinerary::create([
            'user_id' => auth()->user()->user_id,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'days' => $days,
            'budget' => $validated['budget'],
            'itinerary_description' => $validated['itinerary_description'],
        ]);


        for ($i = 0; $i < $days; $i++) {
            Day::create([
                'itinerary_id' => $itinerary->itinerary_id,
                'day_number' => $itinerary->days,
            ]);
        }

        // Attach destinations name to the itinerary
        $destination = Destination::firstOrCreate([
            'destination_name' => $validated['destination_name'],
        ]);

        // Attach to pivot table
        $itinerary->destinations()->attach($destination->destination_id);

        return response()->json([
            'message' => 'Itinerary created successfully',
            'id' => $itinerary->itinerary_id,
        ], 201);
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Itinerary $itinerary)
    {
        //
    }

    /**
     * Update the specified resource in storage.    
     */
    public function update(UpdateItineraryRequest $request, Itinerary $itinerary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Itinerary $itinerary)
    {
        //
    }

    /**
     * Edit the budget of the specified itinerary.
     */
    public function editBudget(Request $request, $itinerary_id)
    {
        // Validasi input
        $validated = $request->validate([
            'budget' => 'required|numeric|min:0',
        ]);

        // Cari itinerary berdasarkan ID
        $itinerary = Itinerary::find($itinerary_id);

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found.'], 404);
        }

        // Perbarui budget
        $itinerary->budget = $validated['budget'];
        $itinerary->save();

        return response()->json([
            'message' => 'Budget updated successfully.',
            'budget' => $itinerary->budget,
        ], 200);
    }
    
}