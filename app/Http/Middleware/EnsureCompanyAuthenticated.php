<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyAuthenticated
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $companyId = $request->header('X-Company-ID') ?? $request->input('company_id');
        
        if (!$companyId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $company = \App\Models\Company::find($companyId);
        
        if (!$company) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Store company in request for controllers to use
        $request->merge(['company_id' => $company->id]);

        return $next($request);
    }
}
