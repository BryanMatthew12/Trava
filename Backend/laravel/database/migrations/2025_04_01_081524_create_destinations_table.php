<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDestinationsTable extends Migration
{
    public function up()
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id('destination_id');
            $table->string('destination_name'); // Example: Jakarta, Bali, Yogyakarta
            $table->text('description')->nullable(); // General description
            $table->longText('destination_picture')->nullable(); // Store image URL or path
            $table->decimal('latitude', 10, 7)->nullable(); // Latitude for geolocation
            $table->decimal('longitude', 10, 7)->nullable();// Longitude for geolocation
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('destinations');
    }
}
