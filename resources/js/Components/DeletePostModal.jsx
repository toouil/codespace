import useApi from "@/hooks/useApi";
import React, { useEffect } from "react";
import Loader from "./Loader";

export default function DeletePostModal({ setDeletePost, post }) {
    const { postRequest, fetching } = useApi({
        dataTemplate: {
            postid: post?.postid,
        },
        onSuccess: (response) => {
            if (response?.status == 200) {
                return location.reload();
            }
            show_errors(response?.error);
        },
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style = null;
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        postRequest(route("post.delete"));
    };

    return (
        <>
        <section className="delete_post_modal">
            <form
                onSubmit={handleSubmit}
                className="delete_post_form container"
            >
                <h2 className="delete_post_title">
                    Are you sure you want to delete this post ?
                </h2>

                <p>Posts you delete can't be restored.</p>

                <div className="actions">
                    <button onClick={() => setDeletePost(false)} type="button">
                        Cancel
                    </button>

                    <button type="submit" disabled={fetching}>
                        Delete
                    </button>
                </div>
            </form>
        </section>

        { fetching && <Loader /> }
        </>
    );
}
