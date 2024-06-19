import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SettingsLayout from "@/Layouts/SettingsLayout";
import { Head } from "@inertiajs/react";
import UpdateProfile from "./Partials/UpdateProfile";
import UpdatePicture from "./Partials/UpdatePicture";

export default function Profile({ auth, profile }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile settings" />
            <SettingsLayout>
                <UpdatePicture user={profile} />
                <UpdateProfile profile={profile?.profile} />
            </SettingsLayout>
        </AuthenticatedLayout>
    );
}