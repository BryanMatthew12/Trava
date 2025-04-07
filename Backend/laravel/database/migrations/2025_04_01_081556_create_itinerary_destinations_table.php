<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItineraryDestinationsTable extends Migration
{
    public function up()
    {
        Schema::create('itinerary_destinations', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->unsignedBigInteger('itinerary_id'); // Foreign key
            $table->unsignedBigInteger('place_id')->nullable(); // Foreign key (optional if place is not always required)
            $table->unsignedBigInteger('destination_id'); // Foreign key
            $table->unsignedBigInteger('day_id')->nullable(); // Foreign key (optional if day is not always required)
            $table->string('destination_name');
            $table->integer('visit_order'); // Changed to integer for correct ordering
            $table->decimal('est_price', 10, 2)->nullable(); // Changed to decimal for price accuracy
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('itinerary_id')->references('itinerary_id')->on('itineraries')->onDelete('cascade');
            $table->foreign('place_id')->references('place_id')->on('places')->onDelete('set null');
            $table->foreign('destination_id')->references('destination_id')->on('destinations')->onDelete('cascade');
            $table->foreign('day_id')->references('day_id')->on('days')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('itinerary_destinations');
    }
}
