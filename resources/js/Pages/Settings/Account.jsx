import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SettingsLayout from "@/Layouts/SettingsLayout";
import UpdateUsername from "./Partials/UpdateUsername";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import DeleteUserForm from "./Partials/DeleteUserForm";

export default function Account({ auth: { user } }) {
    return (
        <AuthenticatedLayout user={user}>
            <Head title="Account settings" />
            <SettingsLayout>
                <div>
                    <UpdateUsername user={user} />

                    {user.provider == "codespace" && <UpdatePasswordForm  />}

                    <DeleteUserForm />
                </div>
            </SettingsLayout>
        </AuthenticatedLayout>
    );
}
