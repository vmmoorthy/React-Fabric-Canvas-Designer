import Chrome from "@uiw/react-color-chrome";
import { useEffect, useState } from "react";

type prop = {
  value: string,
  onChange: (color: string) => void
}

const InputColor = ({ value, onChange }: prop) => {
  const [color, setColor] = useState(value);
  const [isHidden, setIsHidden] = useState(true);
  useEffect(() => {
    setColor(value)
    setIsHidden(true)
  }, [value])
  const setValue = () => {
    onChange(color)
    setIsHidden(true)
  }
  return (<>
    <div
      tabIndex={0}
      onBlur={setValue}

      onKeyDown={(e) => {
        if (e.key == "Enter") {
          e.currentTarget.blur()
        }
        if (e.key == "Escape") {
          setColor(value)
        }
      }}
      onClick={() => { setIsHidden(false) }} className="relative">
      <h4 className="flex justify-evenly items-center p-1 bg-white border border-gray-200 text-gray-900 dark:text-gray-50 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900  dark:border-neutral-700">
        <div className=" h-10 w-14 " onClick={() => { setValue() }} style={{ backgroundColor: value }}></div>
        {value.toUpperCase()}
      </h4>
      <div className="absolute z-10">
        <Chrome color={color}
          popover="auto"
          onBlur={setValue}
          hidden={isHidden}
          onChange={(color) => { setColor(color.hexa) }} />
      </div>
    </div>

  </>
  );
}

export default InputColor;