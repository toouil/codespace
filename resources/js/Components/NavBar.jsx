import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Logo, Mail, Menu, Moon, Sun } from "@/assets/icons";
import ProfileOptions from "./ProfileOptions";
import SideBar from "./SideBar";
import "@/styles/navbar.css";
import { useThemeContext } from "@/providers/ThemeProvider";
import { useEffect } from 'react';
import Echo from 'laravel-echo';

export default function NavBar({ user }) {
    const [openProfileOption, setOpenProfileOption] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [notificaions, setNotificaions] = useState(10);

    const { toggleTheme } = useThemeContext()

    const setOpenSidebarToFalse = () => {
        setTimeout(() => {
            setOpenSidebar(false);
        }, 10);
    };


    useEffect(() => {
        window.Echo.private(`App.Models.User.${user.id}`)
            .notification((notification) => {
                console.log(notification.message);
                // Display notification to the user
            });

        return () => {
            window.Echo.leave(`App.Models.User.${user.id}`);
        };
    }, []);

    return (
        <>
            <nav id="navbar">
                <div className="nav_right_part">
                    <button
                        type="button"
                        className="expand_menu_btn content_center"
                        onClick={() => setOpenSidebar(true)}
                    >
                        <Menu />
                    </button>
                </div>

                <div className="nav_middle_part">
                    <Link href="/" className="nav_logo_link">
                        <Logo />
                    </Link>
                </div>

                <div className="nav_left_part content_center">
                    <div className="nav_item theme">
                        <button
                            data-title="Theme mode"
                            className="theme_btn btn content_center"
                            type="button"
                            onClick={toggleTheme}
                        >
                            <Sun />
                            <Moon />
                        </button>
                    </div>

                    <div className="nav_item mail">
                        <button
                            className="mail_btn btn content_center"
                            type="button"
                            data-title="Notifications"
                        >
                            <span className="mail_count content_center">
                                {notificaions > 9 ? "9+" : notificaions}
                            </span>

                            <span className="mail_icon">
                                <Mail />
                            </span>
                        </button>
                    </div>

                    <div className="nav_item profile">
                        <button
                            className="profile_btn btn content_center btn"
                            type="button"
                            onClick={() => setOpenProfileOption(true)}
                            data-title="Account"
                        >
                            <img src={user?.picture} alt="profile_picture" />
                        </button>
                    </div>
                </div>
            </nav>

            {openProfileOption && (
                <ProfileOptions
                    setOpenProfileOption={setOpenProfileOption}
                    user={user}
                />
            )}
            {openSidebar && (
                <SideBar
                    smallScreen={true}
                    setOpenSidebarToFalse={setOpenSidebarToFalse}
                />
            )}
        </>
    );
}
