import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Loader from "@/Components/Loader";
import Input from "@/Components/Input";
import { show_errors } from "@/global/Functions";
import { notify_error } from "@/Components/Notify";

export default function Login() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.error) {
            notify_error(flash.error)
        }
    }, [flash])

    const { data, setData, post, processing, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onError: (error) => {
                show_errors(error);
            },
        });
    };

    return (
        <GuestLayout>
            <Helmet>
                <title>Log in | CodeSpace</title>
            </Helmet>

            <div className="auth_title">
                <h1>Log in</h1>
            </div>

            <div className="auth_switch">
                <p>
                    <span className="auth_switch_text">Need an account? </span>
                    <span>
                        <Link className="blue_link" href={route("register")}>
                            Sign up
                        </Link>
                    </span>
                </p>
            </div>

            <form
                className="auth_form content_center y w_100"
                onSubmit={(e) => handleSubmit(e)}
            >
                <Input
                    required
                    type="email"
                    name="email"
                    value={data.email}
                    placeholder="Email"
                    autoComplete="email"
                    onChange={(e) => setData("email", e.target.value)}
                />

                <Input.password
                    required
                    id="input_login_pass"
                    type="password"
                    value={data.password}
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    onChange={(e) => setData("password", e.target.value)}
                />

                <div className="remember_me_section">
                    <label
                        htmlFor="remember_me"
                        className="remember_me_outer content_center"
                    >
                        <input
                            type="checkbox"
                            name="rememberMe"
                            id="remember_me"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="remember_me_inner"></span>
                    </label>
                    <label htmlFor="remember_me" className="remember_me_text">
                        Remember me
                    </label>
                </div>

                <button className="submit_btn w_100" type="submit">
                    Log in with email
                </button>
            </form>

            {processing && <Loader text={"Loading .."} />}
        </GuestLayout>
    );
}
