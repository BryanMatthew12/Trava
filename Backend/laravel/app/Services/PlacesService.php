<?php

namespace App\Services;

use App\Models\Places;
use Illuminate\Support\Arr;

class PlacesService
{
    public function __construct()
    {
        // Inject models or repositories here if needed
    }

    // Add your business logic methods here

    public function updatePlace($request, $place_id)
    {
        $place = Places::findOrFail($place_id);

        $validated = $request->validated();

        // Handle blob file if uploaded
        if ($request->hasFile('place_picture')) {
            $file = $request->file('place_picture');
            $place->place_picture = file_get_contents($file->getRealPath());
        } elseif (isset($validated['place_picture'])) {
            // If not a file upload, but a string (e.g., base64 or URL)
            $place->place_picture = $validated['place_picture'];
        }
        // If neither, do not change the picture

        // Fill other fields (excluding place_picture to avoid overwriting it if not present)
        $place->fill(Arr::except($validated, ['place_picture']));
        $place->save();

        if (isset($validated['category_ids'])) {
            $place->categories()->sync($validated['category_ids']);
        }

        return $place->load('categories');
    }
}
