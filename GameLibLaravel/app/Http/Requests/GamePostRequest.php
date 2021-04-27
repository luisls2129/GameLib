<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GamePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|unique:games'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nombre requerido',
            //'name.unique' => response()->json(['error' => 'Juego ya existente'])
        ];
    }
}
