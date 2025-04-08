<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Threads;
use App\Http\Requests\StoreThreadsRequest;
use App\Http\Requests\UpdateThreadsRequest;
use App\Http\Controllers\Controller;
use App\Services\ThreadsService;
use Illuminate\Http\Request;

class ThreadsController extends Controller
{
    protected $threadsService;

    public function __construct(ThreadsService $threadsService)
    {
        $this->threadsService = $threadsService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = [
            'title' => $request->input('title'),
            'sort_by' => $request->input('sort_by'),
            'order' => $request->input('order'),
        ];

        $threads = $this->threadsService->getThreads($filters);

        return response()->json([
            'message' => 'Threads retrieved successfully!',
            'data' => $threads,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreThreadsRequest $request)
    {
        $thread = $this->threadsService->create($request->validated());

        return response()->json([
            'message' => 'Thread created successfully!',
            'data' => $thread,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $thread = $this->threadsService->getById($id);

        if (!$thread) {
            return response()->json(['message' => 'Thread not found!'], 404);
        }

        return response()->json([
            'message' => 'Thread retrieved successfully!',
            'data' => $thread,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateThreadsRequest $request, $id)
    {
        $thread = $this->threadsService->update($request->validated(), $id);

        if (!$thread) {
            return response()->json(['message' => 'Thread not found!'], 404);
        }

        return response()->json([
            'message' => 'Thread updated successfully!',
            'data' => $thread,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deleted = $this->threadsService->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Thread not found!'], 404);
        }

        return response()->json(['message' => 'Thread deleted successfully!']);
    }
}
