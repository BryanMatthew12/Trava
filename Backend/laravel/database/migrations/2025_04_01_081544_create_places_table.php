<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlacesTable extends Migration
{
    public function up()
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id('place_id'); // Primary Key
            $table->unsignedBigInteger('destination_id'); // Foreign Key
            $table->string('place_name'); // Place Name
            $table->text('description')->nullable(); // Optional Description
            $table->string('location');
            $table->decimal('place_rating');
            $table->string('place_picture');
            $table->decimal('place_est_price');
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('destination_id')->references('destination_id')->on('destinations')->onDelete('cascade');
        });     
    }

    public function down()
    {
        Schema::dropIfExists('places');
    }
}
