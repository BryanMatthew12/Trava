<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\UserPreference;
use App\Http\Controllers\Controller;


class UserPreferenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        $user = auth()->user();

        // Validate category_ids as array
        $request->validate([
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,category_id',
        ]);

        foreach ($request->category_ids as $category_id) {
            UserPreference::updateOrCreate([
                'user_id' => $user->user_id,
                'category_id' => $category_id
            ]);
        }

        return response()->json(['message' => 'Preferences saved successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    //Testing Route 
    public function getByUserId($userId)
    {
        $preference = UserPreference::with('category')->where('user_id', $userId)->get();

        return response()->json([
            'user_id' => $userId,
            'preference' => $preference
        ]);
    }
}
