<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/login');
});
Auth::routes(['verify' => true]);
// Route::get('login', [CustomAuthController::class, 'index'])->name('login');

// Auth::routes();

Route::get('/dashboard/{id}', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
Route::resource('/client', App\Http\Controllers\ClientController::class);
Route::resource('/consumption_profile', App\Http\Controllers\ConsumptionProfileController::class);
Route::get('get_discoms/{stateId}', [App\Http\Controllers\ConsumptionProfileController::class, 'getDiscom'])->name('getDiscom');
Route::post('/consumption_profile_tod', [App\Http\Controllers\ConsumptionProfileController::class, 'getTodData'])->name('getTodData');
// Route::get('/projects/{id}', [App\Http\Controllers\ProjectController::class, 'index'])->name('project.index');
// Route::resource('/project', App\Http\Controllers\ProjectController::class);

