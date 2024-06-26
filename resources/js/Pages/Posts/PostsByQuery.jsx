import PostsLayout from "@/Layouts/PostsLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Helmet } from "react-helmet";

export default function PostsByQuery({ auth: { user }, posts, query }) {
    return (
        <AuthenticatedLayout user={user}>
            <Helmet>
                <title>Saved posts</title>
            </Helmet>
            <PostsLayout user={user} initialPosts={posts} />
        </AuthenticatedLayout>
    );
}
