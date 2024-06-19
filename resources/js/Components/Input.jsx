import { Eye } from "@/assets/icons";
import { forwardRef, useRef } from "react";

const Input = forwardRef(({ className, ...props }, ref) => {
    return (
        <div className="w_100 input_group">
            <input
                className={"w_100 input_style " + className}
                {...props}
                ref={ref}
            />
        </div>
    );
});

const password = forwardRef(({ className, ...props }, ref) => {
    const passwordRef = ref ? ref : useRef();

    const switchInputType = () => {
        passwordRef.current.type =
            passwordRef.current.type === "text" ? "password" : "text";
    };

    return (
        <div className="w_100 input_group">
            <input
                {...props}
                ref={passwordRef}
                className={"w_100 input_style " + className}
            />
            <button
                type="button"
                className="show content_center"
                onClick={switchInputType}
            >
                <Eye />
            </button>
        </div>
    );
});

Input.password = password;

export default Input;
