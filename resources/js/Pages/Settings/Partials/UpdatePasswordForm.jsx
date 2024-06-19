import Input from "@/Components/Input";
import Loader from "@/Components/Loader";
import { show_errors } from "@/global/Functions";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        post,
        processing
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        post(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => location.reload(),
            onError: (errors) => {
                show_errors(errors)
            },
        });
    };

    return (
        <section className={"account_settings_password" + className}>
            <header>
                <h2 className="settings_title">
                    Update Password
                </h2>

                <p className="settings_p">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form
                onSubmit={updatePassword}
                className="account_settings_form bottom"
            >
                <div className="account_settings_password">
                    <div className="passwords_group">
                        <div className="current_password">
                            <label htmlFor="current_password">
                                Current password
                            </label>
                            <Input.password
                                autoComplete="current-password"
                                type="password"
                                ref={currentPasswordInput}
                                name="current_password"
                                className="input_style"
                                value={data.current_password}
                                placeholder="Current password"
                                onChange={(e) =>
                                    setData("current_password", e.target.value)
                                }
                            />
                        </div>
                        <div className="current_password">
                            <label htmlFor="current_password">
                                New password
                            </label>
                            <Input.password
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                type="password"
                                name="new_password"
                                className="input_style"
                                placeholder="New password"
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="current_password">
                            <label htmlFor="current_password">
                                Confirm password
                            </label>
                            <Input.password
                                type="password"
                                name="confirm_password"
                                className="input_style"
                                placeholder="Confirm password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                autoComplete="new-password"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="save_btn">
                    Change
                </button>
            </form>

            { processing && <Loader /> }
        </section>
    );
}
