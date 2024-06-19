import { useEffect, useState } from "react";
import Post from "@/Components/Post";
import CreatePostPopup from "@/Components/CreatePostPopup";
import Search from "@/Components/Search";
import Comments from "@/Components/Comments";
import NotFound from "@/Components/NotFound";
import "@/styles/posts.css";
import AuthUserInfo from "@/Components/AuthUserInfo";

export default function PostsLayout({ user, initialPosts, showUserInfo = true, children }) {
    const [posts, setPosts] = useState(initialPosts);
    const [commentsTab, setCommentsTab] = useState(null);

    const renderPosts =
        posts.length > 0 ? (
            posts.map((post, index) => (
                <Post key={index} post={post} setCommentsTab={setCommentsTab} />
            ))
        ) : (
            <NotFound text="Sorry .. posts not found" />
        );

    const updateCommentsCount = (postId) => {
        const updatedPosts = [...posts].map((post) => {
            if (postId == post.postid) post.comments += 1;
            return post;
        });
        setPosts(updatedPosts);
    };
    return (
        <>
            <div className="posts_page">
                <div className="posts_container">
                    {children || (
                        <div className="posts_header">
                            <CreatePostPopup user={user} />
                            <Search name="search" />
                        </div>
                    )}
                    <div className="posts">{renderPosts}</div>
                </div>

                {showUserInfo && <AuthUserInfo user={user} />}
            </div>
            {commentsTab && (
                <Comments
                    commentsState={[commentsTab, setCommentsTab]}
                    updateCommentsCount={updateCommentsCount}
                />
            )}
        </>
    );
}
