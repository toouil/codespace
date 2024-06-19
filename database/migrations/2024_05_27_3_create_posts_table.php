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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string("postid")->unique();
            $table->string("visibility")->default("public");
            $table->uuid("posted_by");
            $table->string("tags")->nullable();
            $table->longText("content");
            $table->bigInteger("likes")->default(0);
            $table->bigInteger("comments")->default(0);
            $table->timestamps();

            // Define foreign key
            $table->foreign('posted_by')->references('userid')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
