import React, { useEffect, useRef } from "react";
import { Logout, ProfileIcon, Settings } from "@/assets/icons";
import { Link } from "@inertiajs/react";

export default function ProfileOptions({ setOpenProfileOption, user }) {
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = () => {
            setTimeout(() => {
                setOpenProfileOption(false);
            }, 10);
        };

        document.addEventListener("click", handleClick, true);

        return () => {
            document.removeEventListener("click", handleClick, true);
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
