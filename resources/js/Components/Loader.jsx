import React from "react";
import { Logo } from "@/assets/icons";
import "@/styles/loader.css";

export default function Loader({ text }) {
    return (
        <div className="loader_page content_center y">
            <span className="loading_icon">
                <Logo />
            </span>
            {text && <p className="loading_txt"> {text} </p>}
        </div>
    );
}
