import React, { useState } from "react";
import CreatePostBox from "./CreatePostBox";
import "@/styles/createPost.css";
import { Link } from "@inertiajs/react";

export default function CreatePostPopup({ user }) {
    const [createPost, setCreatePost] = useState(false);

    return (
        <>
            <div className="create_new_post container">
                <div className="user_img_link">
                    <Link
                        href={`/profile/${user?.username}`}
                        className="link_img"
                    >
                        <img src={user?.picture} alt="user_picture" />
                    </Link>
                </div>

                <div className="create_post">
                    <button
                        className="create_post_popup"
                        type="button"
                        onClick={() => setCreatePost(true)}
                    >
                        {`What's on your mind, ${user?.username} ?`}
                    </button>
                </div>
            </div>

            {createPost && (
                <CreatePostBox setCreatePost={setCreatePost} user={user} />
            )}
        </>
    );
}
