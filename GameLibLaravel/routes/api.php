<?php

use App\Http\Controllers\api\prueba;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/



Route::post('register', 'App\Http\Controllers\UserController@register');
Route::post('login', 'App\Http\Controllers\UserController@authenticate');
Route::get('getUser/{user_id}', 'App\Http\Controllers\UserController@getUser');
Route::post('postUser/{user_id}', 'App\Http\Controllers\UserController@postUser');

Route::get('lastGamesAdded', 'App\Http\Controllers\api\GameController@lastGamesAdded');
Route::get('games/{game_id}', 'App\Http\Controllers\api\GameController@infoOfGame');
Route::post('games/', 'App\Http\Controllers\api\GameController@addGame');
Route::get('games/', 'App\Http\Controllers\api\GameController@getGames');

Route::get('gamesOf/{user_id}', 'App\Http\Controllers\api\GameController@gamesOf');
Route::get('gamesOf/{user_id}/{game_id}', 'App\Http\Controllers\api\GameController@infoGameOf');
Route::post('gamesOf/{user_id}', 'App\Http\Controllers\api\GameController@addGameToUser');
Route::put('gamesOf/{user_id}/{game_id}', 'App\Http\Controllers\api\GameController@putGameToUser');
Route::delete('gamesOf/{user_id}/{game_id}', 'App\Http\Controllers\api\GameController@deleteGameToUser');
Route::get('comprobarToken', 'App\Http\Controllers\api\GameController@comprobarToken');
