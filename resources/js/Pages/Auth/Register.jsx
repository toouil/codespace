import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link, useForm } from "@inertiajs/react";
import Input from "@/Components/Input";
import Loader from "@/Components/Loader";
import { show_errors } from "@/global/Functions";
import { Helmet } from "react-helmet";

export default function Register() {
    const { data, setData, post, processing, reset } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onError: (error) => {
                show_errors(error);
            },
        });
    };

    return (
        <GuestLayout>
            <Helmet>
                <title>Register | CodeSpace</title>
            </Helmet>

            <div className="auth_title">
                <h1>Create Account</h1>
            </div>

            <div className="auth_switch">
                <p>
                    <span className="auth_switch_text">
                        Already have an account?{" "}
                    </span>
                    <span>
                        <Link className="blue_link" href={route("login")}>
                            Log in
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
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={data.username}
                    autoComplete="username"
                    onChange={(e) => setData("username", e.target.value)}
                />

                <Input
                    required
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={data.email}
                    autoComplete="email"
                    onChange={(e) => setData("email", e.target.value)}
                />

                <Input.password
                    required
                    id="input_register_pass"
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                />

                <Input.password
                    required
                    id="input_register_pass_"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                />
                <button className="submit_btn w_100" type="submit">
                    Sign up with email
                </button>
            </form>
            {processing && <Loader text="Loading ..." />}
        </GuestLayout>
    );
}
