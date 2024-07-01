import React from "react";
import { Link } from "@inertiajs/react";
import "@/styles/comment.css";

export default function Comment({ comment }) {
    const { content, age, formatted_created_at, username, picture } = comment;

    return (
        <div className="comment_container">
            <div className="comment_left_part">
                <div className="comment_user_picture">
                    <Link
                        href={route("profile", { username })}
                        className="comment_user_picture_link content_center"
                    >
                        <img src={picture} alt="comment user picture" />
                    </Link>
                </div>
            </div>

            <div className="comment_right_part">
                <div className="comment_top">
                    <div className="comment_user_details">
                        <Link
                            href={route("profile", { username })}
                            className="comment_username"
                        >
                            {username}
                        </Link>
                    </div>
                    <div className="comment_content">
                        {content &&
                            content.split("\n").map((line, index) => (
                                <div key={index} className="post_content_inner">
                                    {line}
                                </div>
                            ))}
                    </div>
                </div>
                <div className="comment_bottom">
                    <p
                        className="comment_date light_text"
                        data-title={formatted_created_at}
                    >
                        {age}
                    </p>
                </div>
            </div>
        </div>
    );
}
