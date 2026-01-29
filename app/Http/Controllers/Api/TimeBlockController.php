<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeBlock;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TimeBlockController extends Controller
{
    /**
     * Get time blocks for authenticated company by date
     */
    public function index(Request $request)
    {
        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            \Log::warning('TimeBlock index failed - no company_id');
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'date' => 'required|string',
        ]);

        \Log::info('TimeBlock index request', [
            'company_id' => $companyId,
            'date' => $request->date,
        ]);

        $timeBlocks = TimeBlock::where('company_id', $companyId)
            ->where('date', $request->date)
            ->get();

        \Log::info('TimeBlock index found blocks', [
            'count' => $timeBlocks->count(),
            'blocks' => $timeBlocks->toArray(),
        ]);

        // Transform to camelCase for frontend
        $transformed = $timeBlocks->map(function ($block) {
            return [
                'id' => $block->id,
                'employeeId' => $block->employee_id,
                'date' => $block->date,
                'startTime' => $block->start_time,
                'endTime' => $block->end_time,
                'clientName' => $block->client_name,
                'task' => $block->task,
            ];
        });

        return response()->json($transformed);
    }

    /**
     * Create a new time block
     */
    public function store(Request $request)
    {
        \Log::info('TimeBlock store request', [
            'headers' => $request->headers->all(),
            'all_data' => $request->all(),
            'company_id_header' => $request->header('X-Company-ID'),
            'company_id_input' => $request->input('company_id'),
        ]);

        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            \Log::warning('TimeBlock store failed - no company_id', [
                'headers' => $request->headers->all(),
            ]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            // Accept both camelCase and snake_case for frontend compatibility
            $validated = $request->validate([
                'employee_id' => 'required_without:employeeId|string|exists:employees,id',
                'employeeId' => 'required_without:employee_id|string|exists:employees,id',
                'date' => 'required|string',
                'start_time' => 'required_without:startTime|string',
                'startTime' => 'required_without:start_time|string',
                'end_time' => 'required_without:endTime|string',
                'endTime' => 'required_without:end_time|string',
                'client_name' => 'nullable|string|max:255',
                'clientName' => 'nullable|string|max:255',
                'task' => 'nullable|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('TimeBlock validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
            ]);
            throw $e;
        }

        // Normalize to snake_case
        $employeeId = $validated['employee_id'] ?? $validated['employeeId'];
        $startTime = $validated['start_time'] ?? $validated['startTime'];
        $endTime = $validated['end_time'] ?? $validated['endTime'];
        $clientName = $validated['client_name'] ?? $validated['clientName'] ?? null;

        // Verify employee belongs to company
        $employee = Employee::where('id', $employeeId)
            ->where('company_id', $companyId)
            ->firstOrFail();

        $timeBlock = TimeBlock::create([
            'id' => (string) Str::uuid(),
            'company_id' => $companyId,
            'employee_id' => $employeeId,
            'date' => $validated['date'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'client_name' => $clientName,
            'task' => $validated['task'] ?? null,
        ]);

        \Log::info('Time block created successfully', [
            'time_block_id' => $timeBlock->id,
            'company_id' => $companyId,
        ]);

        // Transform to camelCase for frontend
        return response()->json([
            'id' => $timeBlock->id,
            'employeeId' => $timeBlock->employee_id,
            'date' => $timeBlock->date,
            'startTime' => $timeBlock->start_time,
            'endTime' => $timeBlock->end_time,
            'clientName' => $timeBlock->client_name,
            'task' => $timeBlock->task,
        ], 201);
    }

    /**
     * Update a time block
     */
    public function update(Request $request, $id)
    {
        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $timeBlock = TimeBlock::where('id', $id)
            ->where('company_id', $companyId)
            ->firstOrFail();

        $validated = $request->validate([
            'employee_id' => 'sometimes|string|exists:employees,id',
            'employeeId' => 'sometimes|string|exists:employees,id',
            'date' => 'sometimes|string',
            'start_time' => 'sometimes|string',
            'startTime' => 'sometimes|string',
            'end_time' => 'sometimes|string',
            'endTime' => 'sometimes|string',
            'client_name' => 'nullable|string|max:255',
            'clientName' => 'nullable|string|max:255',
            'task' => 'nullable|string',
        ]);

        // Normalize to snake_case for database
        $updateData = [];
        if (isset($validated['employee_id']) || isset($validated['employeeId'])) {
            $updateData['employee_id'] = $validated['employee_id'] ?? $validated['employeeId'];
        }
        if (isset($validated['date'])) {
            $updateData['date'] = $validated['date'];
        }
        if (isset($validated['start_time']) || isset($validated['startTime'])) {
            $updateData['start_time'] = $validated['start_time'] ?? $validated['startTime'];
        }
        if (isset($validated['end_time']) || isset($validated['endTime'])) {
            $updateData['end_time'] = $validated['end_time'] ?? $validated['endTime'];
        }
        if (isset($validated['client_name']) || isset($validated['clientName'])) {
            $updateData['client_name'] = $validated['client_name'] ?? $validated['clientName'];
        }
        if (isset($validated['task'])) {
            $updateData['task'] = $validated['task'];
        }

        // If employee_id is being changed, verify it belongs to company
        if (isset($updateData['employee_id']) && $updateData['employee_id'] !== $timeBlock->employee_id) {
            $employee = Employee::where('id', $updateData['employee_id'])
                ->where('company_id', $companyId)
                ->firstOrFail();
        }

        $timeBlock->update($updateData);
        $timeBlock->refresh();

        // Transform to camelCase for frontend
        return response()->json([
            'id' => $timeBlock->id,
            'employeeId' => $timeBlock->employee_id,
            'date' => $timeBlock->date,
            'startTime' => $timeBlock->start_time,
            'endTime' => $timeBlock->end_time,
            'clientName' => $timeBlock->client_name,
            'task' => $timeBlock->task,
        ]);
    }

    /**
     * Delete a time block
     */
    public function destroy(Request $request, $id)
    {
        $companyId = $request->input('company_id');
        
        if (!$companyId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $timeBlock = TimeBlock::where('id', $id)
            ->where('company_id', $companyId)
            ->firstOrFail();

        $timeBlock->delete();

        return response()->json(['success' => true]);
    }
}
