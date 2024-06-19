import { Head } from "@inertiajs/react";
import PostsLayout from "@/Layouts/PostsLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function PostsByQuery({ auth: { user }, posts, query }) {
    return (
        <AuthenticatedLayout user={user}>
            <Head title={query + " - Search Results"} />
            <PostsLayout user={user} initialPosts={posts} />
        </AuthenticatedLayout>
    );
}
