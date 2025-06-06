<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StorePlacesRequest extends FormRequest
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
        Log ::info('StorePlacesRequest validation triggered');

        return [
            'destination_id' => 'required|exists:destinations,destination_id',
            'place_name' => 'required|string|max:255', // dari google API
            'location_name' => 'nullable|string|max:255', // dari google API
            'place_rating' => 'nullable|numeric|min:0|max:5', // dari google API
            'place_picture' => 'nullable|string',
            'place_description' => 'nullable|string|max:1000', // dari google API
            'place_est_price' => 'nullable|numeric|min:0', // dari google API 
            'operational' => 'nullable|json', // dari google API
            'views' => 'nullable|integer|min:0',

            // Many-to-many category IDs
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,category_id',
        ];
    }
}
