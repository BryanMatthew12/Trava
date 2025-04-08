<?php

namespace App\Services;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationService
{
    /**
     * Get all destinations or filter them based on the request.
     */
    public function getAll(Request $request)
    {
        $query = Destination::query();

        // Example: Add filtering logic based on request parameters
        if ($request->has('name')) {
            $query->where('destination_name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->has('location')) {
            $query->where('destination_location', 'like', '%' . $request->input('location') . '%');
        }
        if($request->has('category')){
            $query->where('category', $request->input('category') . '%');
        }

        return $query->get();
    }

    /**
     * Get a single destination by its ID.
     */
    public function getById($id)
    {
        return Destination::find($id);
    }

    /**
     * Create a new destination.
     */
    public function create(array $data)
    {
        return Destination::create($data);
    }

    /**
     * Update an existing destination.
     */
    public function update(array $data, $id)
    {
        $destination = Destination::find($id);

        if (!$destination) {
            return null;
        }

        $destination->update($data);

        return $destination;
    }

    /**
     * Delete a destination by its ID.
     */
    public function delete($id)
    {
        $destination = Destination::find($id);

        if (!$destination) {
            return null;
        }

        $destination->delete();

        return true;
    }
}