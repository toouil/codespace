import { Head } from "@inertiajs/react";
import PostsLayout from "@/Layouts/PostsLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AllPosts({ auth: { user }, posts }) {
    return (
        <AuthenticatedLayout user={user}>
            <Head title={"CodeSpace | " + user.username} />
            <PostsLayout user={user} initialPosts={posts} />
        </AuthenticatedLayout>
    );
}
