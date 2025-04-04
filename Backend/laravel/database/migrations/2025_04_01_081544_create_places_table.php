<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlacesTable extends Migration
{
    public function up()
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->onDelete('cascade'); // Correct FK reference
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });        
    }

    public function down()
    {
        Schema::dropIfExists('places');
    }
}
