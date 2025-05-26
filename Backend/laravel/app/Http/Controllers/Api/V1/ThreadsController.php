<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreThreadsRequest;
use App\Http\Requests\UpdateThreadsRequest;
use App\Http\Controllers\Controller;
use App\Services\ThreadsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Threads;
use App\Models\User;

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

        $threadsQuery = $this->threadsService->getThreads($filters)
            ->with(['itinerary', 'user']);

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
        $user = $request->user();

        // Tambahkan status liked untuk setiap thread
        $threadsData = collect($threads->items())->map(function ($thread) use ($user) {
            $thread->liked = false;
            if ($user) {
                $thread->liked = $thread->likesUsers()->where('thread_user_likes.user_id', $user->user_id)->exists();
            }
            // Tambahkan username
            $thread->username = $thread->user ? $thread->user->name : null;
            return $thread;
        });

        return response()->json([
            'message' => 'Threads retrieved successfully!',
            'data' => $threadsData,
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

    /**
     * Increment views only once per user.
     */
    public function incrementViews(Request $request, $id)
    {
        $user = $request->user();
        $thread = Threads::find($id);

        if (!$thread) {
            return response()->json(['message' => 'Thread not found!'], 404);
        }

        // Cek apakah user sudah pernah view thread ini
        if (!$thread->viewsUsers()->where('thread_user_views.user_id', $user->user_id)->exists()) {
            $thread->viewsUsers()->attach($user->user_id);
            $thread->views += 1;
            $thread->save();
        }

        return response()->json([
            'message' => 'Thread view counted!',
            'data' => $thread,
        ]);
    }

    /**
     * Toggle like for a thread (like/unlike).
     */
    public function toggleLike(Request $request, $id)
    {
        $user = $request->user();
        $thread = Threads::find($id);

        if (!$thread) {
            return response()->json(['message' => 'Thread not found!'], 404);
        }

        if ($thread->likesUsers()->where('thread_user_likes.user_id', $user->user_id)->exists()) {
            // Sudah like, maka unlike
            $thread->likesUsers()->detach($user->user_id);
            $thread->likes = max(0, $thread->likes - 1);
            $thread->save();
            $liked = false;
        } else {
            // Belum like, maka like
            $thread->likesUsers()->attach($user->user_id);
            $thread->likes += 1;
            $thread->save();
            $liked = true;
        }

        return response()->json([
            'message' => $liked ? 'Thread liked!' : 'Thread unliked!',
            'data' => $thread,
            'liked' => $liked,
        ]);
    }

    /**
     * Search threads by query.
     */
    public function searchThreads(Request $request)
    {
        $title = $request->query('title');
        $userId = $request->query('user_id');
        $threadId = $request->query('thread_id');
        $name = $request->query('name'); // Ganti dari itinerary_name ke name
        $sortBy = $request->query('sort_by', 'descending');
        $page = $request->query('page', 1);
        $perPage = 12;

        $page = is_numeric($page) && $page > 0 ? (int)$page : 1;
        $sortDirection = $sortBy === 'ascending' ? 'asc' : 'desc';
        $offset = ($page - 1) * $perPage;

        $query = Threads::query()->with('itinerary');

        if ($title) {
            $query->where('title', 'LIKE', '%' . $title . '%');
        }
        if ($userId) {
            $query->where('user_id', $userId);
        }
        if ($threadId) {
            $query->where('id', $threadId);
        }
        // Ganti filter itinerary_name ke name
        if ($name) {
            $query->whereHas('itinerary', function ($q) use ($name) {
                $q->where('itinerary_name', 'LIKE', '%' . $name . '%');
            });
        }

        $query->orderBy('created_at', $sortDirection);

        $threads = $query
            ->skip($offset)
            ->take($perPage)
            ->get();

        $total = $query->count();
        $lastPage = ceil($total / $perPage);

        return response()->json([
            'message' => 'Threads search result!',
            'data' => $threads,
            'current_page' => $page,
            'last_page' => $lastPage,
            'total' => $total,
        ]);
    }

    /**
     * Delete a thread by ID.
     */
    public function deleteThreads($id)
    {
        $thread = Threads::find($id);

        if (!$thread) {
            return response()->json(['message' => 'Thread not found!'], 404);
        }

        $thread->delete();

        return response()->json(['message' => 'Thread deleted successfully!']);
    }
}
