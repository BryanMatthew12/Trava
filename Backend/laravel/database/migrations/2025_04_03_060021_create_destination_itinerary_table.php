<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDestinationItineraryTable extends Migration
{
    public function up()
    {
        Schema::create('destination_itinerary', function (Blueprint $table) {
            $table->id(); // Primary Key
            
            // Ensure foreign keys reference the correct columns
            $table->unsignedBigInteger('destination_id'); 
            $table->unsignedBigInteger('itinerary_id'); 
            
            $table->timestamps();

            // Correct Foreign Key Constraints
            $table->foreign('destination_id')->references('destination_id')->on('destinations')->onDelete('cascade');
            $table->foreign('itinerary_id')->references('itinerary_id')->on('itineraries')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('destination_itinerary');
    }
}

