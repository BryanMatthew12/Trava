<?php

namespace App\Services;

use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

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
     * Get a single destination by its name.
     */
    public function getDestinationNames()
    {
        return \App\Models\Destination::select('id', 'destination_name')->get();
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
    public function update($request, $id)
    {
        $destination = Destination::find($id);
        if (!$destination) {
            return null;
        }

        $validated = method_exists($request, 'validated') ? $request->validated() : $request->all();

        // Handle blob file if uploaded
        if ($request->hasFile('destination_picture')) {
            $file = $request->file('destination_picture');
            $destination->destination_picture = file_get_contents($file->getRealPath());
        } elseif (isset($validated['destination_picture'])) {
            // If not a file upload, but a string (e.g., base64 or URL)
            $destination->destination_picture = $validated['destination_picture'];
        }
        // If neither, do not change the picture

        // Fill other fields (excluding destination_picture to avoid overwriting it if not present)
        $destination->fill(Arr::except($validated, ['destination_picture']));
        $destination->save();

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