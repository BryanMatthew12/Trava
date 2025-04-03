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
            $table->bigIncrements('id'); // Primary Key
            $table->unsignedBigInteger('user_id'); // Foreign Key (Refers to users.userId)
            $table->decimal('budget', 10, 2);
            $table->date('start_date');
            $table->integer('days');
            $table->text('description');
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('user_id')->references('userId')->on('users')->onDelete('cascade');
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
