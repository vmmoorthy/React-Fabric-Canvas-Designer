import { useState, useRef, useEffect, FunctionComponent } from 'react';
// import { ChevronDown } from 'lucide-react';

interface ColorDropdownProps {
    onChange: (color: string) => void
    currentColor: string
}

const ColorDropdown: FunctionComponent<ColorDropdownProps> = ({ onChange, currentColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const color = currentColor.slice(0, 7);
    const alpha = parseInt(currentColor.slice(7), 16)||255;
    const dropdownRef = useRef<HTMLDivElement>(null);
    // const isChangeByCurrentPropChange = useRef()

    // useEffect(() => {
    //     console.log("currentColor", currentColor);

    //     if (currentColor) {
    //         isChangeByCurrentPropChange.current = true;
    //         setColor(currentColor.slice(0, 7))
    //         setAlpha(parseInt(currentColor.slice(7), 16))
    //     }
    // }, [currentColor])
    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update parent component with color changes
    // useEffect(() => {
    //     const alphaHex = Math.round(alpha).toString(16).padStart(2, '0');
    //     const fullColor = `${color}${ Math.round(alpha).toString(16).padStart(2, '0')}`;
    //     if (fullColor != defaultColor)
    //         if (onChange && !isChangeByCurrentPropChange.current)
    //             onChange(fullColor);
    //     isChangeByCurrentPropChange.current = false
    // }, [color, alpha, onChange]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 min-w-[10rem] px-3 py-2 border rounded-lg shadow-sm hover:bg-gray-50"
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded border"
                        style={{
                            backgroundColor: `${color}${Math.round(alpha).toString(16).padStart(2, '0')}`,
                            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                            backgroundSize: '10px 10px',
                            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                        }}
                    />
                    <span className="text-sm min-w-[5rem]">
                        {`${color}${Math.round(alpha).toString(16).padStart(2, '0')}`}
                    </span>
                </div>
                {/* <ChevronDown className="w-4 h-4" /> */}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 p-4 bg-white border rounded-lg shadow-lg w-64 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => onChange(`${e.target.value}${Math.round(alpha).toString(16).padStart(2, '0')}`)}
                                className="w-12 h-8 p-0 border rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => onChange(`${e.target.value}${Math.round(alpha).toString(16).padStart(2, '0')}`)}
                                className="flex-1 px-2 border rounded text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Opacity: {Math.round(alpha / 2.55)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            defaultValue={255}
                            max="255"
                            value={alpha}
                            onChange={(e) => onChange(`${color}${Math.round(parseInt(e.target.value)).toString(16).padStart(2, '0')}`)}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Preview</label>
                        <div
                            className="h-12 rounded border"
                            style={{
                                backgroundColor: `${color}${Math.round(alpha).toString(16).padStart(2, '0')}`,
                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorDropdown;