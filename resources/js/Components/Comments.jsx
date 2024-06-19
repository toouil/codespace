import { useEffect, useRef } from "react";
import "@/styles/comments.css";
import { Send, Xmark } from "@/assets/icons";
import Comment from "./Comment";
import { Link } from "@inertiajs/react";
import { notify_success } from "./Notify";
import useApi from "@/hooks/useApi";

export default function Comments({ commentsState, updateCommentsCount }) {
    const [{ username, postid }, setCommentsTab] = commentsState;
    const commentInput = useRef();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = null;
        };
    }, []);

    const {
        response: comments,
        fetching,
        getRequest,
    } = useApi({
        dataTemplate: { postid },
        autoFetch: () => getRequest(route("post.getcomments")),
    });

    const { postRequest } = useApi({
        dataTemplate: { postid, content: "" },
        onSuccess: (response) => {
            if (response?.status == 200) {
                notify_success("Comment sent");
                updateCommentsCount(postid);
                commentInput.current.innerText = "";
                getRequest(route("post.getcomments"));
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const contentText = commentInput.current.innerText;
        const content = contentText
            .split("\n")
            .filter((line) => !["", /  +/g].includes(line))
            .join("\n");

        postRequest(route("post.addcomment"), { content });
    };

    return (
        <main className="comments_page">
            <div className="comments_container container">
                <div className="comments_header content_center">
                    <div className="comments_post_owner">
                        <h2>
                            <Link
                                to={`/profile/${username}`}
                                className="comments_post_owner_link bold_text"
                            >
                                {username}
                            </Link>
                            <span>'s post</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => setCommentsTab(null)}
                        className="exit_comments_btn content_center"
                    >
                        <Xmark />
                    </button>
                </div>

                <div className="divider_x"></div>

                <div className="comments_content">
                    {fetching && (
                        <div className="loading_comments">
                            <p>Loading ...</p>
                        </div>
                    )}
                    {comments != null &&
                        (comments?.data.length > 0 ? (
                            comments?.data.map((comment, index) => (
                                <Comment key={index} comment={comment} />
                            ))
                        ) : (
                            <div className="no_comments">
                                <p>No comments rigth now</p>
                            </div>
                        ))}
                </div>

                <div className="divider_x"></div>

                <form
                    className="write_comment_section"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div
                        id="comment_input"
                        className="write_comment_input"
                        contentEditable="true"
                        role="textbox"
                        ref={commentInput}
                    ></div>
                    <div
                        className="submit_comment_btn_container"
                        onClick={() => commentInput.current.focus()}
                    >
                        <button
                            type="submit"
                            className="submit_comment_btn content_center"
                        >
                            <Send />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
