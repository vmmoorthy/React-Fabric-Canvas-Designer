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
    // const onBodyClick = () => setIsHidden(true)
    // document.body.addEventListener("click", onBodyClick)
    // return () => document.body.removeEventListener("click", onBodyClick)
  }, [value])
  // const stopPropagation = e => e.stopPropagation()
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
      <h4 className="flex justify-between items-center">
        <div className="w-5 h-5" onClick={() => { setValue() }} style={{ backgroundColor: value }}></div>
        {value}
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