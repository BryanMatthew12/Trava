<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlacesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'destination_id'    => 'sometimes|exists:destinations,destination_id',
            'place_name'        => 'sometimes|string|max:255',
            'place_description' => 'nullable|string',
            'location_id'       => 'nullable',
            'place_rating'      => 'nullable|numeric|min:0|max:5',
            'place_picture'     => 'nullable|string',
            'place_est_price'   => 'nullable|numeric|min:0',
            'operational'       => 'nullable',
            'views'             => 'nullable|integer|min:0',
            'category_ids'      => 'sometimes|array',
            'category_ids.*'    => 'exists:categories,category_id',
        ];
    }
}
