import { useEffect, useState } from "react";

type prop = {
    value: string,
    onChange: (text: string) => void
}
const InputText = ({ value, onChange }: prop) => {
    const [text, setText] = useState(value);
    useEffect(() => {
        setText(value)
    }, [value])
    return (<input type="text" value={text}
        onBlur={() => onChange(text)}
        onKeyDown={(e) => {
            if (e.key == "Enter") {
                e.currentTarget.blur()
            }
            if (e.key == "Escape") {
                setText(value)
            }
        }} onChange={(e) => setText(e.target.value)} />
    );
}

export default InputText;