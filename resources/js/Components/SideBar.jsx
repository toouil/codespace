import React, { useEffect, useRef } from "react";
import "@/styles/sidebar.css";
import { Link as NavLink } from "@inertiajs/react";

export default function SideBar({ smallScreen, setOpenSidebarToFalse }) {
    const ref = useRef(null);

    useEffect(() => {
        document.addEventListener("click", setOpenSidebarToFalse, true);
        window.addEventListener("resize", setOpenSidebarToFalse, true);

        return () => {
            document.removeEventListener("click", setOpenSidebarToFalse, true);
            window.removeEventListener("resize", setOpenSidebarToFalse, true);
        };
    }, [ref]);

    return (
        <aside
            className={`side_bar container${smallScreen ? " small" : ""}`}
            ref={ref}
            onMouseLeave={smallScreen && setOpenSidebarToFalse}
        >
            <span className="side_bar_item">
                <NavLink href="/" className="side_bar_item_link content_center">
                    Posts
                </NavLink>
            </span>

            <span className="side_bar_item">
                <NavLink
                    href="/categories"
                    className="side_bar_item_link content_center"
                >
                    Assignments
                </NavLink>
            </span>

            <span className="side_bar_item">
                <NavLink
                    href="/users"
                    className="side_bar_item_link content_center"
                >
                    Users
                </NavLink>
            </span>

            <span className="side_bar_item">
                <NavLink
                    href="/Leaderboard"
                    className="side_bar_item_link content_center"
                >
                    Leaderboard
                </NavLink>
            </span>
        </aside>
    );
}
