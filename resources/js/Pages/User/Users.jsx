import Search from "@/Components/Search";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "@/styles/users.css";
import { Head, Link } from "@inertiajs/react";

export default function Users({ auth, users }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Users" />
            
        <div className="users_page">
            <Search name="users.get" />

            <div className="users_container">
                {users.map((user, index) => (
                        <Link
                            key={index}
                            href={`/profile/${user?.username}`}
                            className="user_link content_center"
                        >
                            <img
                                src={user?.picture}
                                alt="pfp"
                            />
                            <h1>{user?.username}</h1>
                        </Link>
                    ))}
            </div>
        </div>
        </AuthenticatedLayout>
    );
}