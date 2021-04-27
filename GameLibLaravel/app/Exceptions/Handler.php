<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            $this->renderable(function (Throwable $exception) {
                //if (request()->is('api*')) {
                    if ($exception instanceof ModelNotFoundException)
                        return response()->json(
                            ['error' => 'Recurso no encontrado'],
                            404
                        );
                    else if ($exception instanceof ValidationException)
                        return response()->json(
                            ['error' => 'Datos no válidos'],
                            400
                        );
                    else if (isset($exception))
                        return response()->json(['error' => 'Error: ' .
                            $exception->getMessage()], 500);
               // }
            });
        });
    }
}
