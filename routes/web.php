<?php

use Illuminate\Support\Facades\Route;

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

// Serve React app for all routes that don't match API routes
// Note: php artisan serve automatically serves static files from public/ before hitting routes
Route::fallback(function () {
    // Don't serve React app for API routes
    if (request()->is('api/*')) {
        abort(404);
    }
    
    // Serve index.html for all other routes
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    abort(404);
});
