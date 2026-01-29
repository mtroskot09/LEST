<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TimeBlockController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes - need session middleware
Route::middleware(['api'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes (using session-based auth)
Route::middleware(['api', 'company.auth'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Employee routes
    Route::apiResource('employees', EmployeeController::class);

    // Time block routes
    Route::get('/timeblocks', [TimeBlockController::class, 'index']);
    Route::post('/timeblocks', [TimeBlockController::class, 'store']);
    Route::patch('/timeblocks/{id}', [TimeBlockController::class, 'update']);
    Route::delete('/timeblocks/{id}', [TimeBlockController::class, 'destroy']);
});
