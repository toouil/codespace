<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function notifications(Request $request)
    {
        try {
            $notifications = Notification::where("reacted_to", $request->user()->userid)
            ->join("users", "users.userid", "=", "notifications.reacted_by")
            ->orderBy("notifications.created_at", "desc")
            ->get(["notifications.*", "users.picture", "users.username"])
            ->map(function($notification) {
                $notification->age = Carbon::parse($notification->created_at)->diffForHumans();
                return $notification;
            });
    
            return response()->json($notifications);
        }
        catch (Exception $err) {
            return response($err->getMessage());
        }
    }
}
