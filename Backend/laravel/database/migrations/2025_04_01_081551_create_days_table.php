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
        Schema::create('days', function (Blueprint $table) {
            $table->id('day_id'); // Primary Key
            $table->unsignedBigInteger('itinerary_id'); // Foreign Key
            $table->integer('day_number'); // Example: Day 1, Day 2
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('itinerary_id')->references('itinerary_id')->on('itineraries')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('days');
    }
};
