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
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->uuid('userid');
            $table->string('category');
            $table->integer('score');
            $table->boolean('passed');
            $table->timestamps();
            $table->foreign('userid')->references('userid')->on('users')->onDelete('cascade');
            $table->foreign('category')->references('name')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
