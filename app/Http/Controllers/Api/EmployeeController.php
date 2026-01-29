<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    /**
     * Get all employees for authenticated company
     */
    public function index(Request $request)
    {
        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $employees = Employee::where('company_id', $companyId)
            ->orderBy('display_order')
            ->get();

        return response()->json($employees);
    }

    /**
     * Create a new employee
     */
    public function store(Request $request)
    {
        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'display_order' => 'integer|min:0',
        ]);

        $employee = Employee::create([
            'id' => (string) Str::uuid(),
            'company_id' => $companyId,
            'name' => $validated['name'],
            'color' => $validated['color'],
            'display_order' => $validated['display_order'] ?? 0,
        ]);

        return response()->json($employee, 201);
    }

    /**
     * Update an employee
     */
    public function update(Request $request, $id)
    {
        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $employee = Employee::where('id', $id)
            ->where('company_id', $companyId)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'color' => 'sometimes|string|max:255',
            'display_order' => 'sometimes|integer|min:0',
        ]);

        $employee->update($validated);

        return response()->json($employee);
    }

    /**
     * Delete an employee
     */
    public function destroy(Request $request, $id)
    {
        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $employee = Employee::where('id', $id)
            ->where('company_id', $companyId)
            ->firstOrFail();

        $employee->delete();

        return response()->json(['success' => true]);
    }
}
