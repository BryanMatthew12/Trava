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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

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
});