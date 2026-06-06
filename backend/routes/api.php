<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ProviderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — WebGIS Kabel Semrawut
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Reports (all authenticated users)
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);

    // Providers (read for all users)
    Route::get('/providers', [ProviderController::class, 'index']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Report management
        Route::put('/reports/{id}/status', [ReportController::class, 'updateStatus']);
        Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

        // Provider management
        Route::post('/providers', [ProviderController::class, 'store']);
        Route::put('/providers/{id}', [ProviderController::class, 'update']);
        Route::delete('/providers/{id}', [ProviderController::class, 'destroy']);
    });
});
