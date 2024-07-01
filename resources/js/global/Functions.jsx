import profile_picture from "@/assets/imgs/profile_picture.png";
import { notify_error } from "@/Components/Notify";

export const profilePictureFormatter = (link) => {
    return link;
};

export const theme_func = (theme) => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
};

export const intToString = (num) => {
    num = num.toString().replace(/[^0-9.]/g, "");
    if (num < 1000) {
        return num;
    }
    let si = [
        { v: 1e3, s: "K" },
        { v: 1e6, s: "M" },
        { v: 1e9, s: "B" },
        { v: 1e12, s: "T" },
        { v: 1e15, s: "P" },
        { v: 1e18, s: "E" },
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
        if (num >= si[index].v) {
            break;
        }
    }
    return (
        (num / si[index].v)
            .toFixed(2)
            .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s
    );
};

export const show_errors = (object) => {
    if (typeof object == "string") {
        notify_error(object);
        return
    }
    
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const value = object[key];
            if (Array.isArray(value)) {
                value.forEach((error) => {
                    notify_error(error);
                });
            } else {
                notify_error(value);
            }
        }
    }
};
