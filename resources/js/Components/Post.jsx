import { useState } from "react";
import { CommentIcon, Like, World, Lock, Dots } from "@/assets/icons";
import { intToString } from "@/global/Functions";
import { Link } from "@inertiajs/react";
import useApi from "@/hooks/useApi";
import PostOptions from "./PostOptions";
import CreatePostBox from "./CreatePostBox";
import DeletePostModal from "./DeletePostModal";

export default function Post({ post, setCommentsTab }) {
    const [updatePost, setUpdatePost] = useState(false);
    const [deletePost, setDeletePost] = useState(false)
    const {
        username,
        picture,
        postid,
        age,
        formatted_created_at,
        tags,
        content,
        likes: likescount,
        comments,
        isLiked,
        visibility,
        created_at,
        updated_at,
    } = post;

    const { postRequest } = useApi({
        dataTemplate: {
            postid,
        },
        onSuccess: (response) => {
            if (response?.status == 200) {
                setLikes({
                    liked: response?.data?.liked,
                    count: response?.data?.count,
                });
                setReactionLoader({ ...reactionLoader, like: null });
            }
        },
    });

    const [likes, setLikes] = useState({
        liked: isLiked,
        count: likescount,
    });

    const [reactionLoader, setReactionLoader] = useState({
        like: null,
        comment: null,
    });

    const handleLike = () => {
        setReactionLoader({ ...reactionLoader, like: true });
        postRequest(route("post.like"));
    };

    const [openPostOptions, setOpenPostOptions] = useState(false);

    const setOpenToFalse = (setState) => {
        setTimeout(() => {
            setState(false);
        }, 10);
    };

    return (
        <>
            <div className="post container">
                <div className="post_header">
                    <div className="post_header_user">
                        <div className="user_picture">
                            <Link
                                href={`/profile/${username}`}
                                className="post_user_picture_link"
                            >
                                <img src={picture} alt="user_img" />
                            </Link>
                        </div>

                        <div className="user_post_details">
                            <span className="post_details_username">
                                <Link
                                    href={`/profile/${username}`}
                                    className="username_link"
                                >
                                    {username}
                                </Link>
                            </span>

                            <span className="post_details_date">
                                <span
                                    className="post_date"
                                    data-title={formatted_created_at}
                                >
                                    {age}
                                </span>

                                <span
                                    className="post_visibility"
                                    data-title={visibility}
                                >
                                    {visibility == "public" ? (
                                        <World data-title={visibility} />
                                    ) : (
                                        <Lock data-title={visibility} />
                                    )}
                                </span>

                                {created_at != updated_at && (
                                    <span className="post_edited">{" (Edited)"}</span>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="post_header_options">
                        <button
                            type="button"
                            onClick={() => setOpenPostOptions(true)}
                            className="openPostOptions"
                        >
                            <Dots />
                        </button>
                        {openPostOptions && (
                            <PostOptions
                                post={post}
                                setUpdatePost={setUpdatePost}
                                setDeletePost={setDeletePost}
                                setOpenPostOptionToFalse={() =>
                                    setOpenToFalse(setOpenPostOptions)
                                }
                            />
                        )}
                    </div>
                </div>

                <div className="post_tags">
                    {tags &&
                        tags.split(",").map(
                            (tag, index) =>
                                tag.trim() !== "" && (
                                    <span key={index} className="post_tag">
                                        <Link
                                            href={`/tag/${tag.trim()}`}
                                            className="post_tag_link"
                                        >
                                            {tag.trim()}
                                        </Link>
                                    </span>
                                )
                        )}
                </div>

                <div className="post_content">
                    {content.split("\n").map((line, index) => (
                        <div
                            key={index}
                            className="post_content_inner"
                            dangerouslySetInnerHTML={{ __html: line }}
                        />
                    ))}
                </div>

                <div className="divider_x"></div>

                <div className="post_reactions">
                    <button
                        className={`like_reaction_btn content_center reaction_btn${
                            likes.liked ? " liked" : ""
                        } ${reactionLoader?.like && "loading"}`}
                        type="button"
                        onClick={handleLike}
                    >
                        <Like />
                        <p className="like_count count">
                            {intToString(+likes.count)}
                        </p>
                    </button>

                    <button
                        className="comment_reaction_btn content_center reaction_btn"
                        type="button"
                        onClick={() => setCommentsTab({ postid, username })}
                    >
                        <CommentIcon />
                        <p className="comment_count count">
                            {intToString(+comments)}
                        </p>
                    </button>
                </div>
            </div>

            {updatePost && <CreatePostBox post={post} setCreatePost={setUpdatePost} />}
            {deletePost && <DeletePostModal post={post} setDeletePost={setDeletePost}/>}
        </>
    );
}