<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class userController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.verify', ['only' => ['getUser', 'postUser']]);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        $user = User::where('email', $request->email)->get()[0];
        return response()->json(compact('token', 'user'));
    }
    public function getAuthenticatedUser()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        return response()->json(compact('user'));
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            if (isset($validator->failed()['name'])) {
                return response()->json('Este nombre ya está en uso', 400);
            } elseif (isset($validator->failed()['email'])) {
                return response()->json('Este email ya está en uso', 400);
            } elseif (isset($validator->failed()['password'])) {
                return response()->json('Contraseña requerida y de mayor de 6 dígitos', 400);
            }
        }


        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->games = [];
        $user->idSteam = "";
        $user->icon = "https://res.cloudinary.com/luislopez2129/image/upload/v1618512120/angular_prueba/jqxie4vdkmttbgkssgwq.png";
        $user->save();

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    public function getUser($user_id)
    {

        $user = User::findOrFail($user_id);

        return response()->json($user);
    }

    public function postUser($user_id, Request $request)
    {

        $user = User::findOrFail($user_id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6'
        ]);

        if ($request->name != "" || isset($request->name)) {
            if ($validator->fails()) {
                if (isset($validator->failed()['name'])) {
                    return response()->json('Este nombre ya está en uso', 400);
                }
            }
            $user->name = $request->name;
        }
        if ($request->email != "" || isset($request->email)) {
            if ($validator->fails()) {
                if (isset($validator->failed()['email'])) {
                    return response()->json('Este email ya está en uso', 400);
                }
            }
            $user->email = $request->email;
        }
        if ($request->password != "" || isset($request->password)) {
            if ($validator->fails()) {
                if (isset($validator->failed()['password'])) {
                    return response()->json($request->password, 400);
                }
            }
            $user->password = Hash::make($request->password);
        }
        if ($request->icon != "" || isset($request->icon) ) {
            $user->icon = $request->icon;
        }
        if ($request->idSteam != "" || isset($request->idSteam) ) {
            $user->idSteam = $request->idSteam;
        }

        $user->save();
        return response()->json($user);
    }
}
