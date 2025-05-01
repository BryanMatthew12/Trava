<?php

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Route::get('/test-curl', function () {
//     try {
//         $client = new Client();
//         $response = $client->get('https://httpbin.org/get');
//         $body = $response->getBody()->getContents();

//         Log::info('Curl Test Success', ['response' => $body]);

//         return 'Curl test successful. Check laravel.log.';
//     } catch (\Exception $e) {
//         Log::error('Curl Test Failed', ['error' => $e->getMessage()]);
//         return 'Curl test failed. Check laravel.log.';
//     }
// });