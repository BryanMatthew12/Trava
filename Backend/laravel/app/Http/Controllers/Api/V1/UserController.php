<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Arr;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all();
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
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        // Prepare the picture as a data URL if it exists
        $user_picture_url = null;
        if ($user->user_picture) {
            $user_picture_url = 'data:image/jpeg;base64,' . base64_encode($user->user_picture);
        }

        return response()->json([
            'username' => $user->username,
            'user_picture' => $user_picture_url,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $User)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateUserRequest $request, $id)
    {
        $validated = $request->validated();

        // Find the user by ID
        $user = User::findOrFail($id);

        // Handle blob file if uploaded
        if ($request->hasFile('user_picture')) {
            $file = $request->file('user_picture');
            $user->user_picture = file_get_contents($file->getRealPath());
        }

        // Fill other fields (excluding user_picture to avoid overwriting it if not present)
        $user->fill(Arr::except($validated, ['user_picture']));
        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user'   => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $User)
    {
        //
    }
 
    //Test Route
    public function getPreferences($id)
    {
        $user = User::with('preferences')->findOrFail($id);

        return response()->json([
            'user_id' => $user->id,
            'preferences' => $user->preferences
        ]);
    }
}
