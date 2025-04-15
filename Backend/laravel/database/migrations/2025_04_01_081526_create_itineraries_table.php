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
        Schema::create('itineraries', function (Blueprint $table) {
            $table->bigIncrements('itinerary_id'); // Primary Key
            $table->unsignedBigInteger('user_id'); // Foreign Key
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('budget', 10, 2);
            $table->text('itinerary_description');
            $table->integer('days')->default(1); // Add the 'days' column with a default value

            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itineraries');
    }
};
