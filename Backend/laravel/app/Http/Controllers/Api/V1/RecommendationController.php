<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Places;
use App\Models\UserPreference;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    
    public function recommendedPlaces($userId)
    {
        $preferredCategoryIds = UserPreference::where('user_id', $userId)->pluck('category_id');

        $places = Places::whereHas('categories', function ($query) use ($preferredCategoryIds) {
            $query->whereIn('categories.category_id', $preferredCategoryIds);
        })->with('categories')->take(15)->get(); // Limit to 5 results

        return response()->json($places);
    }
}
