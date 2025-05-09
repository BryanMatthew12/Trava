<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreItineraryDestinationRequest extends FormRequest
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
    public function rules()
    {
        Log::info('Validation rules applied in StoreItineraryDestinationRequest');

        return [
            'itinerary_id' => 'required|exists:itineraries,itinerary_id',
            'destinations.*.destination_id' => 'required|exists:destinations,destination_id',
            'destinations' => 'required|array|min:1',
            'destinations.*.place_id' => 'required|exists:places,place_id',
            'destinations.*.day_id' => 'required|exists:days,day_id',
            'destinations.*.visit_order' => 'required|integer',  // Add validation for visit_order
            'destinations.*.est_price' => 'nullable',  // Add validation for est_price
        ];
    }

}
