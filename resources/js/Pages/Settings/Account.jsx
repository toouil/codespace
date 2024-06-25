import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SettingsLayout from "@/Layouts/SettingsLayout";
import UpdateUsername from "./Partials/UpdateUsername";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import DeleteUserForm from "./Partials/DeleteUserForm";
import { Helmet } from "react-helmet";

export default function Account({ auth: { user } }) {
    return (
        <AuthenticatedLayout user={user}>
            <Helmet>
                <title>Account settings | CodeSpace</title>
            </Helmet>
            <SettingsLayout>
                <div>
                    <UpdateUsername user={user} />

                    {!user?.google_id && <UpdatePasswordForm  />}

                    <DeleteUserForm />
                </div>
            </SettingsLayout>
        </AuthenticatedLayout>
    );
}
