import toast from "react-hot-toast";

export const notify_success = (content) => {
    toast.success(content, {
        className: "notify",
    });
};

export const notify_error = (content) => {
    toast.error(content, {
        className: "notify",
    });
};
