import { FunctionComponent, useEffect, useState } from 'react';

import ColorDropdown from "./ColorInput";
import { Canvas, FabricText } from 'fabric';
import { FabricObjectAdapter } from './FabricObjectAdapter';

export const getselectedObj = (canvas: Canvas) => {
    if (!canvas) return []
    return canvas.getActiveObjects()

}
interface PropertiesProps {
    canvas: Canvas
}

const Properties: FunctionComponent<PropertiesProps> = ({ canvas }) => {

    const [properties, setProperties] = useState<string[]>([]);
    type propertyValueType = { background: string, borderColor: string }
    const [propertyValue, setPropertyValue] = useState<propertyValueType>({ background: "", borderColor: "" });

    useEffect(() => {
        if (canvas) {
            canvas.on("selection:cleared", setPropertyList)
            canvas.on("selection:created", setPropertyList)
            canvas.on("selection:updated", setPropertyList)
        }
        return () => {
            console.log(canvas);

            if (canvas) {
                canvas.off("selection:cleared", setPropertyList)
                canvas.off("selection:created", setPropertyList)
                canvas.off("selection:updated", setPropertyList)
            }
        }
    }, [canvas])
    const setPropertyList = () => {

        const textbox = new Set(["width", "fontSize", "rotation", "opacity", "textAlign", "fontStyle", "fontWeight", "background", "textBackgroundColor"])
        const image = new Set(["width", "height", "rotation", "opacity", "border", "borderWidth", "borderCurve"])
        const ellipse = new Set(["width", "height", "rotation", "opacity", "border", "borderWidth", "borderCurve", "radious", "background"])
        const rect = new Set(["width", "height", "rotation", "opacity", "border", "borderWidth", "borderCurve", "background"])

        const listOfEle: Set<string> = new Set([])



        if (!canvas)
            setProperties([])

        const objs = canvas.getActiveObjects()

        if (objs.length == 0) {
            // setPropVisibilityList([])
            setProperties([])
        }

        objs.forEach(obj => {
            console.log(obj.type, obj);

            listOfEle.add(obj.type)


        })
        const propertyValues: propertyValueType = {
            background: "",
            borderColor: ""
        }
        const getProperties = (eleName: string) => {
            switch (eleName) {
                case "textbox":
                    // fill - text Color
                    // textBackgroundColor - backgroundColor of he text
                    // stroke - text outer color
                    // strokeWidth - text outer color width (number)
                    propertyValues.background = (objs[0] as FabricText).textBackgroundColor as string
                    propertyValues.borderColor = objs[0].stroke as string
                    return textbox
                case "image":
                    // stroke - borderColor
                    // strokeWidth - borderWidth
                    return image
                case "ellipse":
                    // stroke - borderColor
                    // strokeWidth - borderWidth
                    propertyValues.background = objs[0].fill as string
                    propertyValues.borderColor = objs[0].stroke as string
                    return ellipse
                case "rect":
                    // stroke - borderColor
                    // strokeWidth - borderWidth
                    propertyValues.background = objs[0].fill as string
                    propertyValues.borderColor = objs[0].stroke as string
                    return rect
                default:
                    return new Set([""])
            }
        }



        // intersection of objects properties
        const tools: Set<string> = new Set([])
        const selectedElementTypes = Array.from(listOfEle)
        const baseEleProperties = Array.from(getProperties(selectedElementTypes[0]))
        baseEleProperties.forEach(property => {
            if (selectedElementTypes.length == 1) {
                tools.add(property)
            } else {
                for (let i = 1; i < selectedElementTypes.length; i++) {
                    const eleProperties = getProperties(selectedElementTypes[i]);
                    if (eleProperties.has(property))
                        tools.add(property)
                }
            }
        })

        console.log("tools", tools);
        setProperties(Array.from(tools))
        setPropertyValue(propertyValues)
        // listOfEle.entries(objType=>{
        //     objType
        // tools.add({
        //     title:""
        // })

        // setPropVisibilityList([...listOfProp.values()])
    }

    const handleBackgroundColorChange = (color: string) => {
        if (!canvas) return;
        const selectedObj = getselectedObj(canvas)

        // console.log("selectedObj");

        selectedObj.forEach(obj => {
            const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
            objAdapter.setBackground(color)
            // switch (obj.type) {
            //     case "rect":
            //         obj.set("fill", color);
            //         break;
            //     case "ellipse":
            //         obj.set("fill", color);
            //         break;
            //     case "image":
            //         break;
            //     case "textbox":
            //         obj.set("textBackgroundColor", color);
            //         break;
            // }
        })
        setPropertyValue(p => ({ ...p, background: color }))
        canvas.renderAll()
    }
    const handleBorderColorChange = (color: string) => {
        if (!canvas) return;
        const selectedObj = getselectedObj(canvas)
        console.log("selectedObj");

        selectedObj.forEach(obj => {
            const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
            objAdapter.setBorder(color)

            // switch (obj.type) {
            //     case "rect":
            //         obj.set("stroke", color)
            //         break;
            //     case "ellipse":
            //         obj.set("borderColor", color)
            //         break;
            //     case "image":
            //         break;
            //     case "textbox":
            //         obj.set("stroke", color)
            //         break;
            // }
            obj.set("hasBorders", false);
        })
        setPropertyValue(p => ({ ...p, borderColor: color }))
        canvas.renderAll()
    }
    return (<>
        <div className='flex flex-col gap-2 w-max'>
            {/* <div className='flex flex-col'>
                <label htmlFor="">Fill Color</label>
                <ColorDropdown currentColor={toolProperties.fill} defaultColor={toolProperties.fill} onChange={handlefillColorChange} />
            </div> */}
            {properties.includes("background") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Background Color</label>
                    <ColorDropdown currentColor={propertyValue.background} onChange={handleBackgroundColorChange} />
                </div>}
            {properties.includes("border") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Border Color</label>
                    <ColorDropdown currentColor={propertyValue.borderColor} onChange={handleBorderColorChange} />
                </div>}
            {/* <div className="flex gap-1">
                            <div className='flex flex-col'>
                                <label htmlFor="">Size</label>
                                <input type="number" className='w-min text-center max-w-[4rem]' value={toolProperties.fontSize} onChange={(e) => {
                                    setToolProperties(p => ({ ...p, fontSize: Number(e.target.value) }))
                                }} />
                            </div>
                        </div> */}
            <div className="flex gap-1">
                <div className='flex flex-col'>
                    {/* <label htmlFor="">Font</label>
                    <select onChange={(e) => {
                        // setToolProperties(p => ({ ...p, fontFamily: e.target.value }))
                    }} value={toolProperties.fontFamily}> */}
                    {/* <option value="Times New Roman">Times New Roman</option> */}
                    {/* <option value="Arial">Arial</option> */}
                    {/* <option value="Roboto">Roboto</option>
                                    <option value="Happy Monkey">Happy Monkey</option>
                                    <option value="Yatra One">Yatra One</option>
                                    <option value="Rancho">Rancho</option>
                                    <option value="Permanent Marker">Permanent Marker</option>
                                    <option value="Nerko One">Nerko One</option>
                                    <option value="Itim">Itim</option>
                                    <option value=""></option> */}


                    {/* <option value="Arial,sans-serif">Arial</option>
                        <option value="Verdana,sans-serif">Verdana</option>
                        <option value="Tahoma,sans-serif">Tahoma</option>
                        <option value="Trebuchet MS,sans-serif">Trebuchet MS</option>
                        <option value="Times New Roman,serif">Times New Roman</option>
                        <option value="Georgia,serif">Georgia</option>
                        <option value="Garamond,serif">Garamond</option>
                        <option value="Courier New,monospace">Courier New</option>
                        <option value="Brush Script MT,cursive">Brush Script MT</option>
                    </select> */}
                    {/* <input type="number" className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                </div>

            </div>
            <div className="flex gap-1">
                <div className='flex flex-col'>
                    <label htmlFor="">Font weight</label>
                    {/* <select onChange={(e) => { */}
                    {/* setToolProperties(p => ({ ...p, fontWeight: e.target.value }))
                     }} value={toolProperties.fontWeight}> */}
                    {/* <option value="Times New Roman">Times New Roman</option> */}
                    {/* <option value="Arial">Arial</option> */}
                    {/* <option value="Bold">Bold</option>
                                    <option value="100">100</option> */}
                    {/* <option value="200">200</option> */}
                    {/* <option value="300">300</option> */}
                    {/* <option value="400">400</option> */}
                    {/* <option value="500">500</option> */}
                    {/* <option value="600">600</option> */}
                    {/* <option value="700">700</option> */}
                    {/* <option value="800">800</option> */}
                    {/* <option value="900">900</option> */}
                    {/* </select> */}
                    {/* <input type="number" className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                </div>

            </div>
            <div className="flex gap-1">
                <div className='flex flex-col'>
                    <label htmlFor="">Font Style</label>
                    {/* <select onChange={(e) => {
                        setToolProperties(p => ({ ...p, fontStyle: e.target.value }))
                    }} value={toolProperties.fontStyle}> */}
                    {/* <option value="Times New Roman">Times New Roman</option> */}
                    {/* <option value="Arial">Arial</option> */}
                    {/* <option value="Bold">Bold</option>
                                    <option value="100">100</option> */}
                    {/* <option value="normal">normal</option> */}
                    {/* <option value="oblique">oblique</option> */}
                    {/* <option value="300">300</option> */}
                    {/* <option value="italic">Italic</option> */}
                    {/* <option value="500">500</option> */}
                    {/* <option value="600">600</option> */}
                    {/* <option value="700">700</option> */}
                    {/* <option value="800">800</option> */}
                    {/* <option value="900">900</option> */}
                    {/* </select> */}
                    {/* <input type="number" className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                </div>

            </div>
            <div className="flex gap-1">
                <div className='flex flex-col'>
                    <label htmlFor="">Align</label>
                    {/* <select onChange={(e) => {
                        setToolProperties(p => ({ ...p, textAlign: e.target.value }))
                    }} value={toolProperties.textAlign}>
                        <option value="left">left</option>
                        <option value="right">right</option>
                        <option value="center">center</option>
                        <option value="justify">justify</option>
                    </select> */}
                    {/* <input type="number" className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                </div>

            </div>
            {/* <div className="flex flex-col gap-1">
                            <div className='flex flex-col'>
                                <label htmlFor="">Border Width</label>
                                <input type="number" value={toolProperties.borderWidth} className='w-min text-center max-w-[4rem]' onChange={(e) => handlePropertyChange("borderWidth", Number(e.target.value))} defaultValue={canvas?.width} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="">Border color</label>
                                <ColorDropdown currentColor={toolProperties.fill} defaultColor={toolProperties.fill} onChange={(color) => {
                                    handlePropertyChange("borderColor", color)
                                }} />
                            </div>
                        </div> */}
            <div className="flex gap-1">
                <div className='flex flex-col'>
                    <label htmlFor="">Width</label>
                    {/* <input type="number"
                        value={canvasWidth}
                        onChange={handleNumberChange}
                        className='w-min text-center max-w-[4rem]'
                      onChange={(e) => chagneCanvasSetings(e.target.value)}
                       defaultValue={canvas?.width}
                    /> */}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="">Height</label>
                    {/* <input type="number" value={canvasHeight} className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                </div>
            </div>
        </div>
    </>);
}

export default Properties;