<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Bootstrap rule: first authenticated account becomes admin if none exists yet.
        if (!User::where('is_admin', true)->exists()) {
            $user->is_admin = true;
            $user->save();
        }

        if (!$user->is_admin) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
