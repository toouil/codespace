import Input from "@/Components/Input";
import Loader from "@/Components/Loader";
import { notify_success } from "@/Components/Notify";
import { show_errors } from "@/global/Functions";
import useApi from "@/hooks/useApi";
import React from "react";

export default function UpdateProfile({ profile }) {
    const { data, setData, postRequest, fetching } = useApi({
        dataTemplate: { ...(profile || {}) },
        onSuccess: (response) => {
            if (response?.status == 200) {
                notify_success("Your profile updated");
                return;
            }

            show_errors(response.error);
        },
    });

    const handleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        postRequest(route("update.profile"));
    };

    return (
        <>
            <section className="profile_settings">
                <form onSubmit={handleSubmit} className="profile_settings_form">
                    <div className="profile_settings_bio">
                        <h2 className="settings_title">Edit about</h2>
                        <textarea
                            type="text"
                            name="bio"
                            className="input_style"
                            id="bio"
                            value={data?.bio || ""}
                            placeholder="About you"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="profile_settings_links">
                        <h2 className="settings_title">Edit links</h2>
                        <div>
                            <div className="instagram_link profile_link">
                                <label htmlFor="instagram_input">
                                    Instagram
                                </label>
                                <Input
                                    type="url"
                                    name="instagram"
                                    className="input_style"
                                    id="instagram_input"
                                    value={data?.instagram || ""}
                                    placeholder="Link"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="linkedin_link profile_link">
                                <label htmlFor="linkedin_input">Linkedin</label>
                                <Input
                                    type="url"
                                    name="linkedin"
                                    className="input_style"
                                    id="linkedin_input"
                                    value={data?.linkedin || ""}
                                    placeholder="Link"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="github_link profile_link">
                                <label htmlFor="github_input">Github</label>
                                <Input
                                    type="url"
                                    name="github"
                                    className="input_style"
                                    id="github_input"
                                    value={data?.github || ""}
                                    placeholder="Link"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="website_link profile_link">
                                <label htmlFor="website_input">Website</label>
                                <Input
                                    type="url"
                                    name="website"
                                    className="input_style"
                                    id="website_input"
                                    value={data?.website || ""}
                                    placeholder="Link"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="profile_settings_country">
                        <h2 className="settings_title">Edit country</h2>
                        <Input
                            type="text"
                            name="country"
                            className="input_style"
                            id="country"
                            placeholder="Country"
                            value={data?.country || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="save_btn">
                        Save
                    </button>
                </form>
            </section>

            {fetching && <Loader />}
        </>
    );
}