import PostsLayout from "@/Layouts/PostsLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Helmet } from "react-helmet";

export default function PostsBySave({ auth: { user }, posts }) {
    return (
        <AuthenticatedLayout user={user}>
            <Helmet>
                <title></title>
            </Helmet>
            <PostsLayout user={user} initialPosts={posts} >
                <div className="saved_posts_head">
                    <p className="saved_posts_title">Your saved posts</p>
                </div>
            </PostsLayout>
        </AuthenticatedLayout>
    );
}
