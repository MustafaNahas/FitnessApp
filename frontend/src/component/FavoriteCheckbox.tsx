import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

type HeartCheckboxProps = {
    checked?: boolean;
    onChange?: (value: boolean) => void;
    disableOnClick?:boolean;
};

export default function HeartCheckbox({ checked = false, onChange,disableOnClick }: HeartCheckboxProps) {
    const [isChecked, setIsChecked] = useState<boolean>(checked);

    function toggle(disableOnClick: boolean | undefined) {
        if(!disableOnClick){
            const newValue = !isChecked;
            setIsChecked(newValue);
            if (onChange) onChange(newValue);
        }
    };

    return (
        <div
            onClick={()=>toggle(disableOnClick)}
            style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "3.5rem",
                color: isChecked ? "red" : "gray",
            }}
        >
            <FontAwesomeIcon icon={isChecked ? solidHeart : regularHeart} />
        </div>
    );
}
