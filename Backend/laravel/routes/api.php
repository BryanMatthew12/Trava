<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\DayController;
use App\Http\Controllers\Api\V1\DestinationController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\ItineraryController;
use App\Http\Controllers\Api\V1\ItineraryDestinationController;
use App\Http\Controllers\Api\V1\PlacesController;
use App\Http\Controllers\Api\V1\RecommendationController;
use App\Http\Controllers\Api\V1\ThreadsController;
use App\Http\Controllers\Auth\LoginRegisterController;
use App\Http\Controllers\Api\V1\UserPreferenceController;
use App\Http\Controllers\Api\V1\LocationController;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('auth')->group(function () {
    Route::post('register', [LoginRegisterController::class, 'store']); // Registration
    Route::post('login', [LoginRegisterController::class, 'authenticate']); // Login
    Route::post('refresh', [LoginRegisterController::class, 'refreshToken']);
});

Route::middleware(['auth:api'])->group(function () {
    Route::prefix('v1')->group(function () {
        Route::middleware(['role:1,2'])->group(function () {
            // Route::apiResource('itineraries', ItineraryController::class);
            Route::apiResource('destinations', DestinationController::class);
            // Route::apiResource('places', PlacesController::class);
            Route::apiResource('comments', CommentController::class);
            // Route::apiResource('threads', ThreadsController::class);
            // Route::apiResource('days', DayController::class);
            // Route::apiResource('itinerary-destinations', ItineraryDestinationController::class);
            // Route::apiResource('user-preferences', UserPreferenceController::class);
            
            // Route to search destinations names
            Route::get('destinations/search', [DestinationController::class, 'search']);
            Route::patch('destinations/{id}', [DestinationController::class, 'update']); // update destination

            // Routes to check preference
            Route::get('user-preferences/{userId}', [UserPreferenceController::class, 'getByUserId']);
            Route::post('user-preferences', [UserPreferenceController::class, 'store']);   
            Route::post('update-last-clicked', [UserPreferenceController::class, 'updateLastClicked']);
             
            // Route to get recommended places based on user preferences
            Route::get('recommended-places/{userId}', [RecommendationController::class, 'recommendedPlaces']);
            Route::get('/filtered-places', [PlacesController::class, 'getFilteredPlaces']);

            // Route to get all places
            Route::get('/places/{id}', [PlacesController::class, 'show']);
            Route::delete('/places/{id}', [PlacesController::class, 'destroy']);
            Route::get('/places', [PlacesController::class, 'getAllPlaces']); // get all places
            // Route::get('/places/{name}', [PlacesController::class, 'getAllPlaces']); // get all places
            Route::post('/store-places', [PlacesController::class, 'storePlace']); // store new places
            Route::patch('/places/{id}', [PlacesController::class, 'updatePlace']); // update places
            Route::post('/places/{id}/views', [PlacesController::class, 'incrementViews']); // post views
            Route::post('/places/bulk-store', [PlacesController::class, 'storePlacesBulk']); // store bulk places

            // Route to itineraries 
            Route::get('/itineraries/{itinerary_id}', [ItineraryController::class, 'show']); // load preplanning page
            Route::post('/itineraries', [ItineraryController::class, 'store']); // create new itinerary
            Route::get('/itineraries/user/{user_id}', [ItineraryController::class, 'getUserItineraries']); // get all itineraries by user_id
            Route::patch('/itineraries/{itinerary_id}', [ItineraryController::class, 'editBudget']); // update Budget
            Route::delete('/itineraries/{itinerary_id}', [ItineraryController::class, 'destroy']);
            Route::patch('/itineraries/{itinerary_id}', [ItineraryController::class, 'update']);

            // Route to itineraries destinations
            Route::post('/itinerary-destinations', [ItineraryDestinationController::class, 'store']);
            Route::get('/itinerary-destinations/{itinerary_id}', [ItineraryDestinationController::class, 'show']);
            Route::put('/itinerary-destinations/{itinerary_id}', [ItineraryDestinationController::class, 'update']);

            // Route to get Day Id
            Route::get('/itineraries/{itinerary_id}/days', [DayController::class, 'getDaysByItinerary']);

            // Route to post to Threads
            Route::post ('/itinerary-destinations/{itinerary_id}/export-to-thread', [ItineraryDestinationController::class, 'exportToThread']); // export to threads
            Route::get('/threads', [ThreadsController::class, 'index']); // get threads by itinerary_id
            Route::post('threads/{id}/view', [ThreadsController::class, 'incrementViews']);
            Route::post('threads/{id}/like', [ThreadsController::class, 'toggleLike']);
            Route::get('threads/search', [ThreadsController::class, 'searchThreads']);
            Route::delete('threads/{id}', [ThreadsController::class, 'deleteThreads']);
            
            // Route for Google Maps geocoding
            Route::get('/locations/{placeName}', [LocationController::class, 'fetchPlaceDetails']); // Fetch places details
            Route::post('/locations', [LocationController::class, 'store']);
            Route::get('/search-places', [LocationController::class, 'searchPlacesFromGoogle']); // Search places by name')

            //Route to user controller
            Route::patch('/users/{id}', [UserController::class, 'update']); // update user
            Route::get('/users/{id}', [UserController::class, 'show']); // get user by id
        });     

        // Routes accessible only by 'admin' role
        Route::middleware(['role:1'])->group(function () {
            Route::apiResource('admins', AdminController::class);
        });

        // Routes accessible only by 'user' role
        Route::middleware(['role:2'])->group(function () {
            // Route::apiResource('users', UserController::class);
        });

        
    });

    // Logout route
    Route::post('auth/logout', [LoginRegisterController::class, 'logout']);
});

Route::prefix('public')->group(function () {
    Route::get('/itineraries', [ItineraryController::class, 'index']); // Publicly accessible itineraries
});

// Route::middleware(['auth:api', 'role:admin'])->group(function () {
//     // Routes accessible only by users with the 'admin' role
//     Route::apiResource('admins', AdminController::class);
// });

// Route::middleware(['auth:api', 'role:user'])->group(function () {
//     // Routes accessible only by users with the 'user' role
//     Route::apiResource('users', UserController::class);
// });

// Route to post new itineraries
// Route::middleware(['auth:api', 'role:2'])->post('/itineraries', [ItineraryController::class, 'store']);

// Route to get the authenticated user
Route::get('/user', function (Request $request) {
    return $request->user();
});

