<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\support\Facades\Log;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  mixed  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get the authenticated user
        $user = Auth::user();
        
        $roleMap = [
            1 => 'admin',
            2 => 'user',
        ];

        $userRole = $user->role_id ?? null;

        Log::info('User Role: ' . $userRole);
        Log::info('Allowed Roles: ' . implode(', ', $roles));

        // Check if the user's role is in the allowed roles
        if (!in_array($userRole, $roles)) {
            return response()->json(['message' => 'Forbiddens'], 403); // Corrected spelling 'Forbidden'
        }

        return $next($request);
    }
}

