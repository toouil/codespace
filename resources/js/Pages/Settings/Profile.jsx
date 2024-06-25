import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SettingsLayout from "@/Layouts/SettingsLayout";
import { Head } from "@inertiajs/react";
import UpdateProfile from "./Partials/UpdateProfile";
import UpdatePicture from "./Partials/UpdatePicture";
import { Helmet } from "react-helmet";

export default function Profile({ auth, profile }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Helmet>
                <title>Profile settings | CodeSpace</title>
            </Helmet>

            <SettingsLayout>
                <UpdatePicture user={profile} />
                <UpdateProfile profile={profile?.profile} />
            </SettingsLayout>
        </AuthenticatedLayout>
    );
}