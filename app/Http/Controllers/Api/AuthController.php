<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use \Log;

class AuthController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request)
    {
        Log::info('Login attempt', [
            'username' => $request->username,
            'ip' => $request->ip(),
        ]);

        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $company = Company::where('username', $request->username)->first();

        if (!$company) {
            Log::warning('Login failed - company not found', [
                'username' => $request->username,
            ]);
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!Hash::check($request->password, $company->password)) {
            Log::warning('Login failed - invalid password', [
                'username' => $request->username,
                'company_id' => $company->id,
            ]);
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $responseData = [
            'id' => $company->id,
            'username' => $company->username,
            'name' => $company->name,
        ];

        Log::info('Login successful', [
            'company_id' => $company->id,
            'username' => $company->username,
            'response_data' => $responseData,
        ]);
        
        return response()->json($responseData);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        return response()->json(['success' => true]);
    }

    /**
     * Get current authenticated user
     */
    public function user(Request $request)
    {
        $companyId = $request->header('X-Company-ID') ?? $request->input('company_id');
        
        Log::info('User request', [
            'company_id_header' => $request->header('X-Company-ID'),
            'company_id_input' => $request->input('company_id'),
            'company_id_resolved' => $companyId,
            'all_headers' => $request->headers->all(),
        ]);
        
        if (!$companyId) {
            Log::warning('User request failed - no company_id', [
                'headers' => $request->headers->all(),
            ]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $company = Company::find($companyId);
        
        if (!$company) {
            Log::warning('User request failed - company not found', [
                'company_id' => $companyId,
            ]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $responseData = [
            'id' => $company->id,
            'username' => $company->username,
            'name' => $company->name,
        ];

        Log::info('User request successful', [
            'company_id' => $company->id,
            'username' => $company->username,
        ]);

        return response()->json($responseData);
    }
}
