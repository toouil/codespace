import React, { useEffect, useRef } from "react";
import { Logout, ProfileIcon, Save, Settings } from "@/assets/icons";
import { Link } from "@inertiajs/react";

export default function ProfileOptions({ setOpenProfileOptionToFalse, user }) {
    const ref = useRef(null);

    useEffect(() => {
        document.addEventListener("click", setOpenProfileOptionToFalse, true);

        return () => {
            document.removeEventListener("click", setOpenProfileOptionToFalse, true);
        };
    }, [ref]);

    return (
        <aside className="profile_options container content_center y" ref={ref}>
            <Link
                href={route("profile", { username: user?.username })}
                className="profile_options_items f"
            >
                <ProfileIcon />
                <span className="profile_options_items_text">Profile</span>
            </Link>
            
            <Link
                href={route("posts.bySave")}
                className="profile_options_items s"
            >
                <Save />
                <span className="profile_options_items_text">Saved</span>
            </Link>

            <Link
                href={route("settings.profile")}
                className="profile_options_items s"
            >
                <Settings />
                <span className="profile_options_items_text">Settings</span>
            </Link>


            <div className="divider_x"></div>

            <Link
                className="profile_options_items f logout"
                method="post"
                href={route("logout")}
                as="button"
            >
                <Logout />
                <span className="profile_options_items_text">Log out</span>
            </Link>
        </aside>
    );
}
