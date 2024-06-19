import {
    Clock,
    Github,
    Instagram,
    Link,
    Linkedin,
    Marker,
} from "@/assets/icons";
import { profilePictureFormatter } from "@/global/Functions";
import CreatePostPopup from "@/Components/CreatePostPopup";
import "@/styles/profile.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PostsLayout from "@/Layouts/PostsLayout";
import { Head } from "@inertiajs/react";

function Page({ auth, user }) {
    if (user) {
        return (
            <main className="profile_page">
                <div className="profile_header">
                    <div className="profile_picture">
                        <img
                            src={user?.picture}
                            alt="profile_picture"
                        />
                    </div>

                    <div className="profile_info">
                        <div className="profile_username">
                            <h2>@{user?.username}</h2>
                        </div>
                        <div className="memeber_time content_center">
                            <Clock />
                            <p>{`joined ${user?.formatted_created_at}`}</p>
                        </div>

                        <div className="social_info">
                            <div className="user_links">
                                {user?.profile?.instagram && (
                                    <a
                                        href={user?.profile?.instagram}
                                        target="_blank"
                                        className="content_center"
                                    >
                                        {" "}
                                        <Instagram />{" "}
                                    </a>
                                )}
                                {user?.profile?.linkedin && (
                                    <a
                                        href={user?.profile?.linkedin}
                                        target="_blank"
                                        className="content_center"
                                    >
                                        {" "}
                                        <Linkedin />{" "}
                                    </a>
                                )}
                                {user?.profile?.github && (
                                    <a
                                        href={user?.profile?.github}
                                        target="_blank"
                                        className="content_center"
                                    >
                                        {" "}
                                        <Github />{" "}
                                    </a>
                                )}
                                {user?.profile?.website && (
                                    <a
                                        href={user?.profile?.website}
                                        target="_blank"
                                        className="content_center w"
                                    >
                                        {" "}
                                        <Link /> <p>
                                            {user?.profile?.website}
                                        </p>{" "}
                                    </a>
                                )}
                            </div>
                            {user?.profile?.country && (
                                <>
                                    <div className="divider_y"></div>
                                    <div className="user_country content_center">
                                        <Marker />
                                        <p>{user?.profile?.country}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile_body">
                    {user?.profile?.bio && (
                        <div className="profile_about">
                            <div className="profile_about_title">
                                <h1>About</h1>
                            </div>
                            <div className="profile_about_content">
                                <p>{user?.profile?.bio}</p>
                            </div>
                        </div>
                    )}

                    <div className="profile_badges">
                        <div className="profile_badges_title">
                            <h1>Badges</h1>
                        </div>
                        <div className="profile_badges_content">
                            {user?.scores?.length > 0 ? (
                                user?.scores.map((badge, index) => (
                                    <span
                                        data-title={`${badge?.category?.name} : ${badge?.score}pts`}
                                        key={index}
                                    >
                                        <img
                                            src={badge?.category?.profile_badge}
                                            alt="badge"
                                        />
                                    </span>
                                ))
                            ) : (
                                <p>No badge yet ..</p>
                            )}
                        </div>
                    </div>

                    <div className="profile_posts">
                        <div className="profile_posts_title">
                            <h1>{`${user?.username}'s posts`}</h1>
                        </div>

                        <div className="profile_posts_container">
                            {user?.posts?.status == 200 && (
                                <PostsLayout
                                    user={auth.user}
                                    initialPosts={user?.posts?.data}
                                    showUserInfo={false}
                                >
                                    {auth.user.userid == user.userid ? (
                                        <CreatePostPopup user={auth.user} />
                                    ) : (
                                        <></>
                                    )}
                                </PostsLayout>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return <p>No user with this name !!</p>;
}

export default function Profile({ auth, user }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={user.username + " profile"} />
            <Page auth={auth} user={user} />
        </AuthenticatedLayout>
    );
}
