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
use App\Http\Controllers\Api\V1\ThreadsController;
use App\Http\Controllers\Auth\LoginRegisterController;
use App\Http\Controllers\Api\V1\UserPreferenceController;
use App\Http\Controllers\Api\V1\CategoryController;


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
        Route::apiResource('users', UserController::class);
        Route::apiResource('itineraries', ItineraryController::class);
        Route::apiResource('destinations', DestinationController::class);
        Route::apiResource('places', PlacesController::class);
        Route::apiResource('threads', ThreadsController::class);
        Route::apiResource('comments', CommentController::class);
        Route::apiResource('days', DayController::class);
        Route::apiResource('admins', AdminController::class);
        Route::apiResource('itinerary-destinations', ItineraryDestinationController::class);
        Route::apiResource('user-preference', UserPreferenceController::class);

        //Testing route
        // Route::get('/v1/users/{id}/preferences', [UserController::class, 'getPreferences']);
        Route::get('/v1/user-preference/{userId}', [UserPreferenceController::class, 'getByUserId']);
        Route::get('/places/{id}', [PlacesController::class, 'show']);

    });
    // Logout route
    Route::post('auth/logout', [LoginRegisterController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
});

// Route to get the authenticated user
Route::get('/user', function (Request $request) {
    return $request->user();
});