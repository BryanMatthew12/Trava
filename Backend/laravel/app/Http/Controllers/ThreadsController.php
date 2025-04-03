<?php

namespace App\Http\Controllers;

use App\Models\Threads;
use App\Http\Requests\StoreThreadsRequest;
use App\Http\Requests\UpdateThreadsRequest;

class ThreadsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreThreadsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Threads $threads)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Threads $threads)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateThreadsRequest $request, Threads $threads)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Threads $threads)
    {
        //
    }
}
