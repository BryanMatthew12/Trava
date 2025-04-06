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
            $table->text('content')->nullable(); // Detailed information about the destination
            $table->string('destination_picture')->nullable(); // Store image URL or path
            $table->string('destination_location'); // Address or GPS coordinates
            $table->string('operational')->nullable(); // Example: "08:00 - 17:00"
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('destinations');
    }
}
