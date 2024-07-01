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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string("like_reaction_id")->unique()->nullable();
            $table->string("comment_reaction_id")->unique()->nullable();
            $table->uuid('reacted_to');
            $table->uuid('reacted_by');
            $table->string('type');
            $table->boolean('read')->default(false);
            $table->timestamps();

            
            //i want to add same foreign key
            $table->foreign("like_reaction_id")->references('reaction_id')->on('likes')->onDelete('cascade');
            $table->foreign("comment_reaction_id")->references('reaction_id')->on('comments')->onDelete('cascade');

            $table->foreign('reacted_to')->references('userid')->on('users')->onDelete('cascade');
            $table->foreign('reacted_by')->references('userid')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
