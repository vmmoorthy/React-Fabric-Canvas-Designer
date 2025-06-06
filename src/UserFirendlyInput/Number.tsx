import { useEffect, useState } from "react";

type prop = {
    value: number | undefined,
    onChange: (value: number) => void
    min?: number
    step?: number // increment / decrement
}
const InputNumber = ({ min, step, value, onChange }: prop) => {
    const [number, setNumber] = useState<number>(value || 0);
    useEffect(() => {
        if (value === undefined) return
        setNumber(value)
    }, [value])
    useEffect(() => {
        if (value === undefined) return
        onChange(number)
    }, [number])

    const handleDecrement = () => {
        setNumber(prevValue => {
            if (min)
                if (prevValue > min)
                    return prevValue - (step || 1)
                else return min
            else return prevValue - (step || 1)
        });
    };

    const handleIncrement = () => {
        setNumber(prevValue => prevValue + (step || 1));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        if (!isNaN(newValue)) {
            setNumber(newValue);
        }
    };
    return <div className="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex items-center gap-x-1.5">
            <button
                type="button"
                tabIndex={-1}
                disabled={!value}
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                aria-label="Decrease"
                onClick={handleDecrement}
            >
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                </svg>
            </button>
            <input
                className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                style={{ MozAppearance: 'textfield' }}
                type="number"
                disabled={!value}
                aria-roledescription="Number field"
                value={number}
                onChange={handleChange}
            />
            <button
                tabIndex={-1}
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                aria-label="Increase"
                onClick={handleIncrement}
            >
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
            </button>
        </div>
    </div>
    // return (<input type="text" value={number}
    //     onBlur={() => onChange(number)}
    //     onKeyDown={(e) => {
    //         if (e.key == "Enter") {
    //             e.currentTarget.blur()
    //         }
    //         if (e.key == "Escape") {
    //             setNumber(value)
    //         }
    //     }} onChange={(e) => isValidNumber(e.target.value) && setNumber(Number(e.target.value))} />
    // );
}

export default InputNumber;