<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Destination;
use App\Services\DestinationService;
use App\Http\Requests\StoreDestinationRequest;
use App\Http\Requests\UpdateDestinationRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    protected $destinationService;

    /**
     * Inject the DestinationService into the controller.
     */
    public function __construct(DestinationService $destinationService)
    {
        $this->destinationService = $destinationService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $destinations = $this->destinationService->getAll($request);
        return response()->json($destinations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDestinationRequest $request)
    {
        $data = $request->validated();
        $destination = $this->destinationService->create($data);

        return response()->json($destination, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $destination = $this->destinationService->getById($id);

        if (!$destination) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        return response()->json($destination);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDestinationRequest $request, $id)
    {
        $destination = $this->destinationService->update($request, $id);

        if (!$destination) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        return response()->json(['message' => 'Destination updated successfully', 'destination' => $destination]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $result = $this->destinationService->delete($id);

        if (!$result) {
            return response()->json(['message' => 'Destination not found'], 404);
        }

        return response()->json(['message' => 'Destination deleted successfully']);
    }

    /**
     * Get destination names.
     */
    public function search(Request $request)
    {
        $query = $request->input('q');

        $destinations = Destination::where('destination_name', 'LIKE', "%{$query}%")
                                ->select('id', 'destination_name')
                                ->get();

        return response()->json($destinations);
    }


}