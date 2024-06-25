import { Head } from "@inertiajs/react";
import PostsLayout from "@/Layouts/PostsLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Helmet } from "react-helmet";

export default function AllPosts({ auth: { user }, posts }) {
    return (
        <AuthenticatedLayout user={user}>
            <Helmet>
                <title>{user.username} | CodeSpace</title>
            </Helmet>
            <PostsLayout user={user} initialPosts={posts} />
        </AuthenticatedLayout>
    );
}
