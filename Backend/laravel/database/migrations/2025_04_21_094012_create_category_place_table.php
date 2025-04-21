<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('category_place', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('place_id');
        $table->unsignedBigInteger('category_id');

        $table->foreign('place_id')->references('place_id')->on('places')->onDelete('cascade');
        $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_place');
    }
};
