type optionType = { value: string, displayValue: string };
type prop = {
    value: optionType,
    onChange: (selected: optionType) => void
    options: optionType[]
}
const InputSelect = ({ value, onChange, options }: prop) => {
    return <div className="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:text-white dark:bg-neutral-900 dark:border-neutral-700">
        <select value={value.value} onChange={e => onChange(options.find(option => option.value == e.target.value) || options[0])}>
            {options.map((option) => {
                return <option key={option.value} value={option.value}>{option.displayValue}</option>
            })}
        </select>
    </div >
}

export default InputSelect;