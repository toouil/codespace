import { useState } from "react";
import { ArrowDown } from "@/assets/icons";
import "@/styles/dropdown.css";

export default function Dropdown({
    options,
    defaultOption = null,
    placeHolder = "Select...",
    callValueWith,
    callLabelWith,
    onChange,
    ...props
}) {
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value == defaultOption));

    const handleSelect = (option) => {
        setSelectedOption(option);
        onChange(option);
        setOpenMenu(false);
    };

    return (
        <div className="dropdown" {...props}>
            <button
                type="button"
                className="dropdownHead"
                onClick={() => setOpenMenu(!openMenu)}
            >
                <span>{selectedOption?.label || placeHolder}</span>
                <span style={{ rotate: openMenu ? "180deg" : "0deg" }}>
                    <ArrowDown />
                </span>
            </button>
            <div className={"dropdownBody " + (openMenu ? "open" : "")}>
                {options.map((option) => (
                    <button
                        key={option[callValueWith]}
                        type="button"
                        className="dropdownBodyItem"
                        onClick={() => handleSelect(option)}
                    >
                        {option[callLabelWith]}
                    </button>
                ))}
            </div>
        </div>
    );
}
