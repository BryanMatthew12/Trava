<?php

namespace App\Http\Controllers\Api\V1;

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
        'title' => $request->input('title'), // Get the title from the query string
        'sort_by' => $request->input('sort_by'),
        'order' => $request->input('order', 'desc'), // Default to descending order
        'user_id' => $request->input('user_id'), // Get the user_id from the query string
        'thread_id' => $request->input('thread_id'), // Get the thread_id from the query string
    ];

    $threadsQuery = $this->threadsService->getThreads($filters);

    // Apply filtering by user_id if provided
    if (!empty($filters['user_id'])) {
        $threadsQuery->where('user_id', $filters['user_id']);
    }

    // Apply filtering by thread_id if provided
    if (!empty($filters['thread_id'])) {
        $threadsQuery->where('thread_id', $filters['thread_id']);
    }

    // Apply sorting
    if ($filters['sort_by'] == 2) {
        $threadsQuery->orderBy('views', $filters['order']);
    } elseif ($filters['sort_by'] == 3) {
        $threadsQuery->orderBy('likes', $filters['order']);
    } else {
        $threadsQuery->orderBy('created_at', $filters['order']); // Default to "Most Recent"
    }

    $threads = $threadsQuery->paginate(12);

    return response()->json([
        'message' => 'Threads retrieved successfully!',
        'data' => $threads->items(),
        'current_page' => $threads->currentPage(),
        'last_page' => $threads->lastPage(),
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
