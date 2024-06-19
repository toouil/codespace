import { Head } from "@inertiajs/react";
import PostsLayout from "@/Layouts/PostsLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function PostsByTag({ auth: { user }, posts, tag }) {
    return (
        <AuthenticatedLayout user={user}>
            <Head title={"#" + tag + " - Explore codeSpace"} />
            <PostsLayout user={user} initialPosts={posts}>
                <div className="posts_tag_top w_100 container">
                    <div>
                        <span>
                            # <span className="bold_text">{tag}</span>
                        </span>
                        <p>
                            {posts.length > 0 &&
                                "People are posting about this"}
                        </p>
                    </div>
                </div>
            </PostsLayout>
        </AuthenticatedLayout>
    );
}
