import useApi from "@/hooks/useApi";
import { useEffect, useRef, useState } from "react";
import { notify_success } from "./Notify";

export default function PostOptions({
    post,
    setOpenPostOptionToFalse,
    setUpdatePost,
    setDeletePost,
}) {
    // const [savedSlug, setSavedSlug] = useState(post.isSaved ? "Unsave": "Save")
    const options = [
        {
            slug: "Edit",
            callback: () => setUpdatePost(true),
            allow: post.owner,
        },
        {
            slug: "Delete",
            callback: () => setDeletePost(true),
            allow: post.owner,
        },
        {
            slug: post.isSaved ? "Unsave": "Save",
            callback: () => {
                postRequest(route("post.save"))
            },
            allow: true,
        }
    ];

    const ref = useRef(null);
    const { postRequest } = useApi({
        dataTemplate : {
            postid : post.postid
        },
        onSuccess: (res) => {
            notify_success( res.saved ? "Post saved" : "Post unsaved" )
            post.isSaved = res.saved
        }
    })

    useEffect(() => {
        document.addEventListener("click", setOpenPostOptionToFalse, true);

        return () => {
            document.removeEventListener(
                "click",
                setOpenPostOptionToFalse,
                true
            );
        };
    }, [ref]);

    return (
        <aside className="post_options container" ref={ref}>
            {options.filter(({ allow }) => allow ).map((option) => (
                <button
                    key={option.slug}
                    type="button"
                    className="post_options_item"
                    onClick={option.callback}
                >
                    { option.slug }
                </button>
            ))}
        </aside>
    );
}
