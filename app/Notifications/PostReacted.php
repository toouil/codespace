<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class PostReacted extends Notification
{
    use Queueable;

    private $reactType;

    public function __construct($reactType)
    {
        $this->reactType = $reactType;
    }

    public function via($notifiable)
    {
        return ['broadcast'];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'reactType' => $this->reactType,
            'message' => 'Someone reacted to your post.',
        ]);
    }
}