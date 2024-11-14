import TextField from "@mui/material/TextField";
import { useState } from "react";
import { ChangeEvent } from "react";

export default function NumField(props: { onChange: (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, value: number, label: string; }) {
    const [value, setValue] = useState(props.value.toString());
    return (
        <TextField
            className="w-full"
            type="number"
            label={props.label}
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                let parsed = parseFloat(e.target.value);
                if (!isNaN(parsed)) {
                    props.onChange(e);
                }
            }
            } />
    );
}