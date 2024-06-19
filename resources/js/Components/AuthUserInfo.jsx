import { Pen } from "@/assets/icons";
import useApi from "@/hooks/useApi";
import "@/styles/authuserinfo.css";
import { Link } from "@inertiajs/react";

export default function AuthUserInfo({ user }) {
    const { response, getRequest } = useApi({
        autoFetch: () => getRequest(route("profile.authuser")),
    });

    return (
        <div className="authenticatedUser container content_center y">
            <Link
                href={route("settings.profile")}
                data-title="edit you informations"
                className="edit_profile_link"
            >
                <Pen />
            </Link>
            {response && (
                <>
                    <div className="image content_center">
                        <Link href={"/profile/" + user.username}>
                            <img src={user?.picture} alt="pfp" />
                        </Link>
                    </div>
                    <div className="username content_center">
                        <Link
                            href={"/profile/" + user.username}
                            className="user_link"
                        >
                            {user?.username}
                        </Link>
                    </div>
                    <div className="bio content_center">
                        <p>{response?.profile?.bio || "no bio yet"}</p>
                    </div>
                </>
            )}
        </div>
    );
}
