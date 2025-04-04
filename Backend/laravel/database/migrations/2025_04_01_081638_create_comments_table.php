<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->unsignedBigInteger('user_id'); // Foreign Key to users table (userId)
            $table->unsignedBigInteger('thread_id'); // Foreign Key to threads table (id)
            $table->text('content'); // Content of the comment
            $table->timestamps();

            // Foreign Key Constraints
            $table->foreign('user_id')->references('userId')->on('users')->onDelete('cascade'); // Cascade delete user
            $table->foreign('thread_id')->references('id')->on('threads')->onDelete('cascade'); // Cascade delete thread
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
