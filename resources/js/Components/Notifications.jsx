import axios from "axios";
import React, { useEffect, useState } from "react";
import "@/styles/notifications.css";

export default function Notifications({
    notificationsCountState,
    openNotifications,
    setOpenNotificationToFalse
}) {
    const [notificationsCount, setNotificationsCount] = notificationsCountState;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
        setInterval(() => {
            fetchNotifications();
        }, 1000 * 60);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/notifications");
            setNotifications(response.data);
            setNotificationsCount(response.data.length - notifications.length);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (openNotifications) {
            document.addEventListener("click", setOpenNotificationToFalse, true);
        }

        return () => {
            document.removeEventListener("click", setOpenNotificationToFalse, true);
        };
    }, [openNotifications]);

    if (openNotifications) {
        return (
            <div id="notifications" className="container">
                {
                notifications.length > 0 ? notifications.map((notification) => (
                    <div className="notification" key={notification.id}>
                        <div className="left_part">
                            <img src={notification.picture} alt="picture of reacter" />
                        </div>
                        <div className="right_part">
                            <span className="reaction"><span className="user"> { notification.username } </span>{notification.type === 'like' ?  " liked your post" : " commented on your post" }</span>
                            <span className="age">{ notification.age }</span>
                        </div>
                    </div>
                )) : <p>You have no notification right now</p>}
            </div>
        );
    }
}
