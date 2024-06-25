import Search from "@/Components/Search";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "@/styles/users.css";
import { Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";

export default function Users({ auth, users, userquery = null }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Helmet>
                {
                    userquery ? <title>{userquery} users search results | CodeSpace</title> : <title>Users | CodeSpace</title>
                }
                
            </Helmet>
            
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