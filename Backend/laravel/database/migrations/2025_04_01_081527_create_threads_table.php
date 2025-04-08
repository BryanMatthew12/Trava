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
        Schema::create('threads', function (Blueprint $table) {
            $table->bigIncrements('thread_id'); // Primary Key
            $table->unsignedBigInteger('user_id'); // Foreign Key
            $table->string('thread_title'); // Thread title
            $table->text('thread_content'); // Thread content
            $table->string('thread_picture')->nullable(); // Image path column
            $table->unsignedBigInteger('likes')->default(0);   
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('threads');
    }
};