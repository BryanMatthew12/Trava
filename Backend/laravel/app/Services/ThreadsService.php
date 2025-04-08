<?php

namespace App\Services;

use App\Models\Threads;

class ThreadsService
{
    /**
     * Get all threads with optional sorting and searching.
     *
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getThreads(array $filters = [])
    {
        $query = Threads::query();

        // Search by title
        if (!empty($filters['title'])) {
            $query->where('thread_title', 'like', '%' . $filters['title'] . '%');
        }

        // Sort by likes, views, or title
        if (!empty($filters['sort_by']) && in_array($filters['sort_by'], ['likes', 'views', 'thread_title'])) {
            $order = in_array($filters['order'], ['asc', 'desc']) ? $filters['order'] : 'desc';
            $query->orderBy($filters['sort_by'], $order);
        }

        return $query->get();
    }

    /**
     * Get a single thread by its ID.
     *
     * @param int $id
     * @return Threads|null
     */
    public function getById($id)
    {
        return Threads::find($id);
    }

    /**
     * Create a new thread.
     *
     * @param array $data
     * @return Threads
     */
    public function create(array $data)
    {
        return Threads::create($data);
    }

    /**
     * Update an existing thread.
     *
     * @param array $data
     * @param int $id
     * @return Threads|null
     */
    public function update(array $data, $id)
    {
        $thread = Threads::find($id);

        if (!$thread) {
            return null;
        }

        $thread->update($data);

        return $thread;
    }

    /**
     * Delete a thread by its ID.
     *
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        $thread = Threads::find($id);

        if (!$thread) {
            return false;
        }

        $thread->delete();

        return true;
    }
}
