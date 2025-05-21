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
            $table->unsignedBigInteger('destination_id');
            $table->string('place_name'); 
            $table->text('place_description')->nullable(); 
            $table->unsignedBigInteger('location_id')->nullable();
            $table->decimal('place_rating', 3, 2);
            $table->longText('place_picture')->nullable();
            $table->decimal('place_est_price', 10, 2);
            $table->json('operational')->nullable(); 
            $table->integer('views')->default(0);
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('destination_id')->references('destination_id')->on('destinations')->onDelete('cascade');
            $table->foreign('location_id')->references('location_id')->on('locations')->onDelete('set null'); // Optional: or 'cascade' or 'restrict'
        });     
    }

    public function down()
    {
        Schema::dropIfExists('places');
    }
}
