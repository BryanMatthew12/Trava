nim
nimjee
In voice
skripsi

nim — 5/5/2025 7:21 PM
@shuaa
shuaa — 5/5/2025 7:24 PM
okeh
shuaa — 5/5/2025 11:28 PM
Image
itu temen gw si gray
skripsi kelompok
tbtb begitu
rip cok
nim — 5/5/2025 11:28 PM
hah
anjir
gmn itu
itu ga kekejer gmn cok
shuaa — 5/5/2025 11:29 PM
ya begitu
wkwkwowk
ga ngerti
nim — 5/5/2025 11:29 PM
kok bisa ga kekejer
shuaa — 5/5/2025 11:29 PM
lu buka fb dia bisa ga
nim — 5/5/2025 11:29 PM
fb gua ga ada
awoakwowk
di hek
T_T
shuaa — 5/5/2025 11:29 PM
gausa login gbisa yak
nim — 5/5/2025 11:29 PM
knp emg fesbuk dia
shuaa — 5/5/2025 11:29 PM
ya intinya
dia cerita disono
sebulan di ghosting dospem
trus tbtb di chat begitu
ama temennya
nim — 5/5/2025 11:31 PM
ohhh
anjir
mengsad
untung kita dosennya yg ngejer bjir
teori dosen pengejar > dosen dikejar
metew — Yesterday at 12:20 PM
tar lanjut jam 2 gas
nim — Yesterday at 12:24 PM
gas
nim — Yesterday at 2:01 PM
ngumpul2
ges
@shuaa @metew
metew — Yesterday at 2:05 PM
wokeh
abar ya
lagi eeq
yum yum
nim — Yesterday at 2:05 PM
pap eeq
metew — Yesterday at 2:05 PM
kea pisang yg ini
shuaa — Yesterday at 2:05 PM
abar lagi makan bru dateng makanan gw
metew — Yesterday at 2:05 PM
pisang king
nim — Yesterday at 2:05 PM
mau liat eek pls
nim — Yesterday at 2:51 PM
.
shuaa — Yesterday at 3:43 PM
.
nim — Yesterday at 3:51 PM
851702002566607
metew — 10:17 AM
jam 12an kali gas
nim — 10:26 AM
gazken
shuaa — 10:26 AM
gw keknya hari ini mau cabut
tar kalo tugas
bagi ke gw aja
metew — 11:07 AM
wokehh
amangg
shuaa — 12:05 PM
gajadi hari ini bisa bsk yg gbisa
bentar
gw makan trus otw
shuaa — 1:36 PM
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaces, appendPlaces, clearPlaces, selectPlaces } from '../../slices/places/placeSlice';
import { useLocation } from 'react-router-dom';
import { fetchPlaces } from '../../api/places/places'; // Import fetchPlaces
import { editBudget } from '../../api/itinerary/editBudget';
import Select from 'react-select'; // Import React-Select
import { useSearchParams } from 'react-router-dom';
import { fetchDayId } from '../../api/dayId/fetchDayId'; // Import fetchDayId
import { useNavigate } from 'react-router-dom';
import { postItinerary } from '../../api/itinerary/postItinerary';
import { fetchCoord } from '../../api/mapCoord/fetchCoord'; // Import fetchCoord

const PlanItinerary = (onPlaceChange) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces); // Get places from Redux store
  const [dayId, setDayId] = useState([]); // State to store dayId
  const [page, setPage] = useState(1); // State to manage pagination
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const [currentBudget, setCurrentBudget] = useState(location.state?.budget || 0); // State untuk budget
  const itineraryId = searchParams.get('params'); // Get itineraryId from URL params
  const [destinations, setDestinations] = useState([]); // State to store destinations
  const [selectPlace, setSelectPlace] = useState(); // State to store selected places
  const [activePlaceId, setActivePlaceId] = useState(null); // State to track active place ID
  
  const {
    start,
    end,
    budget,
    desc,
    destination,
    destinationId,
  } = location.state || {}; // Destructure the state object

  // Calculate the number of days
  const startDate = new Date(start);
  const endDate = new Date(end);
  const tripDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start day

  // Generate an array of days
  const days = Array.from({ length: tripDuration }, (_, i) => `Day ${i + 1}`);

  // State to track visibility of each day's details
  const [visibleDays, setVisibleDays] = useState(
    Array.from({ length: tripDuration }, () => true) // Default: all days visible
  );

  // State to store selected places for each day
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  // Fetch places based on destinationId when component mounts
  useEffect(() => {
    const fetchPlacesByDestination = async () => {
      if (destinationId) {
        try {
          const placesData = await fetchPlaces(destinationId, 1); // Fetch initial places (page 1)
          dispatch(setPlaces(placesData)); // Dispatch places to Redux store
        } catch (error) {
          console.error('Error fetching places by destinationId:', error.message);
          dispatch(clearPlaces()); // Clear places if there's an error
        }
      }
    };

    fetchPlacesByDestination();
  }, [destinationId, dispatch]);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        const dayData = await fetchDayId(itineraryId); // Fetch the day data
        const dayIds = dayData.map((day) => day.day_id); // Extract all day_id values
        setDayId(dayIds); // Set the dayId state with the extracted day_id values
        console.log('Fetched day IDs:', dayIds);
      } catch (error) {
        console.error('Error fetching day data:', error.message);
      }
    };

    fetchDayData();
  }, [itineraryId]);
  
    useEffect(() => {
      const getCoordinates = async () => {
        try {
          const destinations = await fetchCoord(selectPlace);
          const coordinates = destinations?.data;
  
          if (coordinates) {
            const { latitude, longitude } = coordinates;
            onPlaceChange(latitude, longitude); // pass to callback
          }
        } catch (error) {
          console.error("Failed to fetch coord", error.message);
        }
      };
... (263 lines left)
Collapse
message.txt
16 KB
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
}