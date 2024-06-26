import { useEffect, useRef, useState } from "react";
import { Xmark } from "@/assets/icons";
import { show_errors } from "@/global/Functions";
import { Link, usePage } from "@inertiajs/react";
import Loader from "./Loader";
import useApi from "@/hooks/useApi";
import Dropdown from "./Dropdown";

export default function CreatePostBox({ setCreatePost, post = {} }) {
    const { user } = usePage().props.auth
    const [isFetching, setIsFetching] = useState(false);
    const { data, setData, postRequest } = useApi({
        dataTemplate: {
            postid: post?.postid || null,
            tags: post?.tags || "",
            content: post?.content ||  "",
            visibility: post?.visibility ||  "public"
        },
        onSuccess: (response) => {
            if (response?.status == 200) {
                return location.reload();
            }

            setIsFetching(false);
            show_errors(response?.error)
        },
        onError: () => {
            setIsFetching(false);
        },
    });

    const setTags = (text) => {
        const tagsFilter = text
            .split(",")
            .map((tag) =>
                tag.replace(/  +/g, " ").replace(/[^a-zA-Z0-9, ]/g, "")
            )
            .join(",");
        setData("tags", tagsFilter);
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style = null;
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        postRequest(route("post.add"));
        setIsFetching(true);
    };

    return (
        <div className="create_new_post_page content_center">
            <div className="create_new_post_modelbox container">
                <div className="modelbox_header content_center">
                    <div className="modelbox_title">
                        <h2>Create post</h2>
                    </div>

                    <div className="exit_modelbox">
                        <button
                            className="exit_modelbox_btn content_center"
                            type="button"
                            onClick={() => setCreatePost(false)}
                        >
                            <Xmark />
                        </button>
                    </div>
                </div>

                <div className="divider_x"></div>

                <form
                    className="create_post_content"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="create_post_content_header">
                        <div className="user_picture">
                            <Link
                                href={`/profile/${user?.username}`}
                                className="post_user_picture_link"
                            >
                                <img src={user?.picture} alt="user_img" />
                            </Link>
                        </div>

                        <div className="user_post_details">
                            <span className="post_details_username">
                                {user?.username}
                            </span>
                            <span className="post_details_visibility">
                                <Dropdown
                                    callLabelWith="label"
                                    callValueWith="value"
                                    onChange={(op) =>
                                        setData("visibility", op?.value)
                                    }
                                    defaultOption={data.visibility}
                                    options={[
                                        {
                                            value: "public",
                                            label: "Public",
                                        },
                                        {
                                            value: "private",
                                            label: "Private",
                                        },
                                    ]}
                                />
                            </span>
                        </div>
                    </div>

                    <div className="create_post_content_tags">
                        <input
                            type="text"
                            className="create_post_tags_input"
                            placeholder="Tags"
                            value={data.tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                    <div className="create_post_content_text">
                        <textarea
                            className="create_post_content_text_input"
                            placeholder={`What's on your mind, ${user?.username} ?`}
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                        />
                    </div>

                    <div className="submit_post_section">
                        <button
                            type="submit"
                            className="submit_post_btn content_center"
                            disabled={isFetching}
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>

            {isFetching && <Loader text="Posting" />}
        </div>
    );
}
