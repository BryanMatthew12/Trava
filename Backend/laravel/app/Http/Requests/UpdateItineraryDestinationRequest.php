<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItineraryDestinationRequest extends FormRequest
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
                'destinations' => 'required|array|min:1',
                'destinations.*.day_id' => 'required|exists:days,day_id',
                'destinations.*.place_id' => 'required|exists:places,place_id',
                'destinations.*.visit_order' => 'required|integer|min:1',
                'destinations.*.est_price' => 'nullable|numeric',
                'itinerary.*.budget' => 'nullable|numeric',
            ];
    }
}
