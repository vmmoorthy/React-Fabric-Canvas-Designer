import { useEffect, useState } from "react";

type prop = {
    value: number,
    onChange: (text: number) => void
}
const InputNumber = ({ value, onChange }: prop) => {
    const [number, setNumber] = useState(value);
    useEffect(() => {
        setNumber(value)
    }, [value])
    const isValidNumber = (text: string): boolean => {
        return !isNaN(Number(text))
    }

    return (<input type="text" value={number}
        onBlur={() => onChange(number)}
        onKeyDown={(e) => {
            if (e.key == "Enter") {
                e.currentTarget.blur()
            }
            if (e.key == "Escape") {
                setNumber(value)
            }
        }} onChange={(e) => isValidNumber(e.target.value) && setNumber(Number(e.target.value))} />
    );
}

export default InputNumber;