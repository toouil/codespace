import Input from "@/Components/Input";
import Loader from "@/Components/Loader";
import { show_errors } from "@/global/Functions";
import { useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        post,
        processing,
        reset,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        post(route("delete.account"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: (res) => {
                show_errors(res)
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={"delete_user_section " + className}>
            <header>
                <h2 className="settings_title">
                    Delete Account
                </h2>

                <p className="">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted
                </p>
            </header>

            <button onClick={confirmUserDeletion} className="openConfirmModalButton">Delete Account</button>

            <ConfirmationModel
                show={confirmingUserDeletion}
                onClose={closeModal}
            >
                <form onSubmit={deleteUser} className="delete_user_form container">
                    <h2 className="settings_title">
                        Are you sure you want to delete your account?
                    </h2>

                    <p>
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                        <Input.password
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            placeholder="Password"
                        />

                    <div className="actions">
                        <button onClick={closeModal} type="button">Cancel</button>

                        <button type="submit" disabled={processing}>
                            Delete Account
                        </button>
                    </div>
                </form>
            </ConfirmationModel>

            { processing && <Loader /> }
        </section>
    );
}

function ConfirmationModel({ show, children }) {
    useEffect(() => {
        if (show) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = null;
        }
    }, [show]);

    if (show) {
        return <section className="confirme_delete_model">{children}</section>;
    }
}
