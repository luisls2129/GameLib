<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GameOfUserPostRequest;
use App\Http\Requests\GameOfUserPutRequest;
use App\Http\Requests\GamePostRequest;
use App\Models\Game;
use App\Models\LastGamesAdded;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use MongoDB\Model\IndexInfo;
use stdClass;

use function PHPUnit\Framework\isEmpty;

class GameController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.verify', ['except' => ['lastGamesAdded']]);
    }

    public function lastGamesAdded()
    {
        $LastGamesAdded = LastGamesAdded::get();

        $arrayResponse = array();

        foreach ($LastGamesAdded as $value) {
            $user = User::findOrFail($value->user_id);
            $game = Game::findOrFail($value->game_id);

            $finalUser = new stdClass();
            $finalUser->id = $user->id;
            $finalUser->name = $user->name;
            $finalUser->icon = $user->icon;

            $finalGame = new stdClass();
            $finalGame->id = $game->id;
            $finalGame->url_image = $game->url_image;
            $finalGame->name = $game->name;

            foreach ($user->games as $value) {
                if ($value['game_id'] == $game->id) {
                    $finalGame->commentary = $value['commentary'];
                    $finalGame->assessment = $value['assessment'];
                    $finalGame->time = $value['time'];
                    $finalGame->start_date = $value['start_date'];
                }
            }

            $response = new stdClass();
            $response->user = $finalUser;
            $response->game = $finalGame;

            array_push($arrayResponse, $response);
        }

        return response()->json($arrayResponse);
    }

    public function infoOfGame($game_id)
    {
        $game = Game::findOrFail($game_id);
        return response()->json($game);
    }

    public function addGame(GamePostRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:games'
        ]);

        if ($validator->fails()) {
            if (isset($validator->failed()['name'])) {
                return response()->json('Este juego ya existe', 400);
            }
        }

        $request->url_image = ($request->url_image == null || $request->url_image == "") ? 'url_por_defecto' : $request->url_image;

        $game = new Game();
        $game->name = $request->name;
        $game->url_image = $request->url_image;
        $game->save();

        return response()->json($game);
    }

    public function getGames()
    {
        $games = Game::get();

        return response()->json($games);
    }

    public function gamesOf($user_id)
    {
        $user = User::findOrFail($user_id);
        $games = $user->games;

        $respuesta = [];
        foreach ($games as $value) {
            $gameOf = new stdClass();
            $gameOf->game_id = $value['game_id'];
            $gameOf->commentary = $value['commentary'];
            $gameOf->assessment = $value['assessment'];
            $gameOf->time = $value['time'];
            $gameOf->start_date = $value['start_date'];

            $game = Game::findOrFail($value['game_id']);
            $gameOf->url_image = $game->url_image;
            $gameOf->name = $game->name;

            array_push($respuesta, $gameOf);
        }

        return response()->json($respuesta);
    }

    public function infoGameOf($user_id, $game_id)
    {
        $user = User::findOrFail($user_id);
        $games = $user->games;

        $game = "";
        foreach ($games as $value) {
            if ($value['game_id'] == $game_id) {
                $game = $value;
            }
        }

        return response()->json($game);
    }

    public function addGameToUser($user_id, GameOfUserPostRequest $request)
    {
        $user = User::findOrFail($user_id);
        $games = $user->games;

        $unique = true;
        foreach ($games as $value) {
            if ($value['game_id'] == $request->game_id) {
                $unique = false;
            }
        }

        if ($unique) {
            $gameOf = new stdClass();
            $gameOf->game_id = $request->game_id;
            $gameOf->commentary = $request->commentary;
            $gameOf->assessment = $request->assessment;
            $gameOf->time = $request->time;
            $gameOf->start_date = $request->start_date;

            array_push($games, $gameOf);
            $user->games = $games;
            $user->save();

            //add to lastGameAdded
            $lastAdded = new LastGamesAdded();
            $lastAdded->user_id = $user->id;
            $lastAdded->game_id = $gameOf->game_id;
            $lastAdded->save();

            //controlar solo 10 ultimos
            $allLastAdded = LastGamesAdded::orderBy('created_at')->get();
            if (count($allLastAdded) > 10) {
                $allLastAdded[0]->delete();
            }
            return response()->json($gameOf);
        } else {
            return response()->json(['error' => 'Ya tienes añadido ese juego']);
        }
    }

    public function putGameToUser($user_id, $game_id, Request $request)
    {
        $user = User::findOrFail($user_id);
        $games = $user->games;
        $newGames = [];

        //dejar fuera al juego que queremos cambiar
        for ($i = 0; $i < count($games); $i++) {
            if ($games[$i]['game_id'] == $game_id) {
                $game = $games[$i];
            } else {
                array_push($newGames, $games[$i]);
            }
        }

        if (isset($request->commentary)) {
            $game['commentary'] = $request->commentary;
        }
        if (isset($request->assessment)) {
            $game['assessment'] = $request->assessment;
        }
        if (isset($request->time)) {
            $game['time'] = $request->time;
        }
        if (isset($request->start_date)) {
            $game['start_date'] = $request->start_date;
        }

        array_push($newGames, $game);
        //Ordenar de mayor a menor
        usort($newGames, $this->object_sorter('start_date'));

        $user->games = $newGames;
        $user->save();

        return response()->json($user);
    }

    function object_sorter($clave,$orden='DESC') {
        return function ($a, $b) use ($clave,$orden) {
              $result=  ($orden=="DESC") ? strnatcmp($b[$clave], $a[$clave]) :  strnatcmp($a[$clave], $b[$clave]);
              return $result;
        };
    }

    public function deleteGameToUser($user_id, $game_id)
    {
        $user = User::findOrFail($user_id);
        $gamesOf = $user->games;
        $newGamesOf = [];

        for ($i = 0; $i < count($gamesOf); $i++) {
            if ($gamesOf[$i]['game_id'] != $game_id) {
                array_push($newGamesOf, $gamesOf[$i]);
            }else{
                $allLastGamesAdded = LastGamesAdded::get();
                foreach ($allLastGamesAdded as $value) {
                    if ($value->game_id == $game_id) {
                        $value->delete();
                    }
                }
            }
        }

        $user->games = $newGamesOf;
        $user->save();
        return response()->json($user->games);
    }



    public function comprobarToken()
    {
        return response()->json(true);
    }
}
