<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\UserPreference;

class UserPreferenceService
{
    public function updateInterestLevel($userId, $clickedCategoryId, $isFromRegister = false)
    {
        $maxInterestSum = 10;

        DB::transaction(function () use ($userId, $clickedCategoryId, $maxInterestSum, $isFromRegister) {
            $preferences = UserPreference::where('user_id', $userId)->get()->keyBy('category_id');

            // Step 1: Update or create preference
            if ($preferences->has($clickedCategoryId)) {
                $clickedPref = $preferences[$clickedCategoryId];
                $clickedPref->interest_level += 1;
                $clickedPref->last_clicked_at = now();
                $clickedPref->save();
            } else {
                $clickedPref = UserPreference::create([
                    'user_id' => $userId,
                    'category_id' => $clickedCategoryId,
                    'interest_level' => 1,
                    'last_clicked_at' => now(),
                ]);
                $preferences->put($clickedCategoryId, $clickedPref);
            }

            // Step 2: Skip adjustment if coming from register
            if ($isFromRegister) return;

            // Step 3: Adjust other interests if sum exceeds limit
            $totalInterest = $preferences->sum('interest_level');

            if ($totalInterest > $maxInterestSum) {
                $excess = $totalInterest - $maxInterestSum;

                $otherCategories = $preferences->filter(fn($pref) => $pref->category_id != $clickedCategoryId)
                                               ->sortBy('last_clicked_at');

                foreach ($otherCategories as $pref) {
                    if ($excess <= 0) break;

                    $reduction = min($pref->interest_level, $excess);
                    $pref->interest_level -= $reduction;
                    $excess -= $reduction;

                    if ($pref->interest_level <= 0) {
                        $pref->delete();
                    } else {
                        $pref->save();
                    }
                }
            }
        });
    }
}
