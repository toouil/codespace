import Input from "@/Components/Input";
import Loader from "@/Components/Loader";
import { notify_success } from "@/Components/Notify";
import { show_errors } from "@/global/Functions";
import useApi from "@/hooks/useApi";

export default function UpdateUsername({ user }) {
    const { data, setData, postRequest, fetching } = useApi({
        dataTemplate: {
            username: user.username,
        },
        onSuccess: (response) => {
            if (response?.status == 200) {
                notify_success("Username updated")
                return location.reload()
            }

            show_errors(response.error)
        },
    });

    const hundleSubmit = (event) => {
        event.preventDefault();
        postRequest(route("update.username"));
    };

    return (
        <section>
            <form onSubmit={hundleSubmit} className="account_settings_form top">
                <div className="account_settings_username">
                    <h2 className="settings_title">Edit username</h2>
                    <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        className="input_style"
                        value={data?.username}
                        onChange={(event) => {
                            setData("username", event.target.value);
                        }}
                    />
                </div>

                <button type="submit" className="save_btn">
                    Save
                </button>
            </form>

            {fetching && <Loader />}
        </section>
    );
}
