import { FC, useEffect, useState } from 'react';

import { Canvas } from 'fabric';
import ColorDropdown from "./ColorInput";
import { FabricObjectAdapter } from './FabricObjectAdapter';

export const getselectedObj = (canvas: Canvas) => {
    if (!canvas) return []
    return canvas.getActiveObjects()

}
interface PropertiesProps {
    canvas: Canvas
}

const Properties: FC<PropertiesProps> = ({ canvas }) => {

    // const [properties, setProperties] = useState<string[]>([]);
    // type propertyValueType = { background: string, borderColor: string, width: number, height: number, borderWidth: number }
    const [propertyValue, setPropertyValue] = useState<{ [key: string]: any }>({});
    console.log("propertyValue", propertyValue)
    useEffect(() => {
        if (canvas) {
            canvas.on("selection:cleared", setPropertyList)
            canvas.on("selection:created", setPropertyList)
            canvas.on("selection:updated", setPropertyList)
            canvas.on("object:modified", setPropertyList)
        }
        return () => {
            console.log(canvas);

            if (canvas) {
                canvas.off("selection:cleared", setPropertyList)
                canvas.off("selection:created", setPropertyList)
                canvas.off("selection:updated", setPropertyList)
                canvas.off("object:modified", setPropertyList)
            }
        }
    }, [canvas])
    const setPropertyList = () => {

        // const textbox = new Set(["width", "fontSize", "rotation", "opacity", "textAlign", "fontStyle", "fontWeight", "background", "textBackgroundColor"])
        // const image = new Set(["width", "height", "rotation", "opacity", "border", "borderWidth", "borderCurve"])
        // const ellipse = new Set(["width", "height", "rotation", "opacity", "border", "borderWidth", "borderCurve", "radious", "background"])
        // const rect = new Set(["width", "height", "rotation", "opacity", "border", "borderWidth", "borderCurve", "background"])

        // const listOfSelectedEle: Set<CustomFabric> = new Set([])



        if (!canvas)
            return setPropertyValue({})

        const objs = canvas.getActiveObjects()

        // if (objs.length == 0) {
        // return 
        setPropertyValue({})
        // }

        objs.forEach(obj => {
            // let customObj;
            console.log(obj.type, obj);
            const customObj = FabricObjectAdapter.createAdapter(obj.type, obj)

            // switch (obj.type) {
            //     case "textbox":
            //         customObj = new TextBoxObj(obj as Textbox);
            //         break;
            //     case "image":
            //         customObj = new FabricImageObj(obj as FabricImage);
            //         break;
            //     case "ellipse":
            //         customObj = new EllipseObj(obj as Ellipse);
            //         break;
            //     case "rect":
            //         customObj = new RectObj(obj as Rect);
            //         break;
            //     default:
            //         customObj = new CustomFabric(obj as FabricObject);
            //         break;
            // }
            setPropertyValue(pre => ({ ...pre, ...customObj.getObjectValues() }))

        })

        // const propertyValues: propertyValueType = {
        //     background: "",
        //     borderColor: "",
        //     borderWidth: 1,
        //     width: 0,
        //     height: 0
        // }
        // const getProperties = (eleName: string) => {
        //     switch (eleName) {
        //         case "textbox":
        //             // fill - text Color
        //             // textBackgroundColor - backgroundColor of he text
        //             // stroke - text outer color
        //             // strokeWidth - text outer color width (number)
        //             propertyValues.background = (objs[0] as FabricText).textBackgroundColor as string
        //             propertyValues.borderColor = objs[0].stroke as string
        //             propertyValues.width = objs[0].width
        //             propertyValues.height = objs[0].height
        //             return textbox
        //         case "image":
        //             // stroke - borderColor
        //             // strokeWidth - borderWidth
        //             return image
        //         case "ellipse":
        //             // stroke - borderColor
        //             // strokeWidth - borderWidth
        //             propertyValues.background = objs[0].fill as string
        //             propertyValues.borderColor = objs[0].stroke as string
        //             return ellipse
        //         case "rect":
        //             // stroke - borderColor
        //             // strokeWidth - borderWidth
        //             propertyValues.background = objs[0].fill as string
        //             propertyValues.borderColor = objs[0].stroke as string
        //             propertyValues.borderWidth = objs[0].strokeWidth as number
        //             return rect
        //         default:
        //             return new Set([""])
        //     }
        // }



        // intersection of objects properties
        // const tools: Set<string> = new Set([])
        // const selectedElementTypes = Array.from(listOfSelectedEle)
        // const baseEleProperties = Array.from(getProperties(selectedElementTypes[0]))
        // baseEleProperties.forEach(property => {
        //     if (selectedElementTypes.length == 1) {
        //         tools.add(property)
        //     } else {
        //         for (let i = 1; i < selectedElementTypes.length; i++) {
        //             const eleProperties = getProperties(selectedElementTypes[i]);
        //             if (eleProperties.has(property))
        //                 tools.add(property)
        //         }
        //     }
        // })

        // console.log("tools", tools);
        // setProperties(Array.from(tools))
        // setPropertyValue(propertyValues)
        // listOfEle.entries(objType=>{
        //     objType
        // tools.add({
        //     title:""
        // })

        // setPropVisibilityList([...listOfProp.values()])
    }
    // const propertyChange = (propertyName: string, value: string | number) => {
    //     if (!canvas) return;
    //     const selectedObj = getselectedObj(canvas)
    //     selectedObj.forEach(obj => {
    //         const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
    //         switch (propertyName) {
    //             case "background":
    //                 objAdapter.setBackground(value.toString())
    //                 setPropertyValue(p => ({ ...p, background: value.toString() }))
    //                 break;
    //             case "borderColor":
    //                 objAdapter.setBorder(value.toString())
    //                 setPropertyValue(p => ({ ...p, borderColor: value.toString() }))

    //                 break;


    //             default:
    //                 break;
    //         }

    //     })
    //     canvas.renderAll()
    // }


    // const handleBorderColorChange = (color: string) => {
    //     if (!canvas) return;
    //     const selectedObj = getselectedObj(canvas)

    //     selectedObj.forEach(obj => {
    //         const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
    //         objAdapter.setBorder(color)

    //         obj.setCoords();
    //         obj.set("hasBorders", false);
    //     })
    //     setPropertyValue(p => ({ ...p, borderColor: color }))
    //     canvas.renderAll()
    // }
    // const handleWidthChange = (width: number) => {
    //     if (!canvas) return;
    //     const selectedObj = getselectedObj(canvas)


    //     selectedObj.forEach(obj => {
    //         const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
    //         objAdapter.setWidth(width)

    //         obj.set("hasBorders", false);
    //     })
    //     setPropertyValue(p => ({ ...p, width }))
    //     canvas.renderAll()
    // }
    // const handleBorderWidthChange = (width: number) => {
    //     if (!canvas) return;
    //     const selectedObj = getselectedObj(canvas)


    //     selectedObj.forEach(obj => {
    //         const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
    //         objAdapter.setBorderWidth(width)


    //         obj.set("hasBorders", false);
    //         obj.setCoords()
    //     })
    //     setPropertyValue(p => ({ ...p, width }))
    //     canvas.renderAll()
    // }

    const handlePropertyChange = (propertyKey: string, value: any) => {
        console.warn('propertyKey', propertyKey, "value", value);

        if (!canvas) return;
        const selectedObj = getselectedObj(canvas)


        selectedObj.forEach(obj => {
            const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
            console.log(objAdapter.obj)
            objAdapter.propertyListMap[propertyKey](value)


            // obj.set("hasBorders", false);
            obj.setCoords()
        })
        setPropertyValue(p => ({ ...p, [propertyKey]: value }))
        canvas.renderAll()
    }

    return (<>
        <div className='flex flex-col gap-2 w-max'>
            {/* <div className='flex flex-col'>
                <label htmlFor="">Fill Color</label>
                <ColorDropdown currentColor={toolProperties.fill} defaultColor={toolProperties.fill} onChange={handlefillColorChange} />
                </div> */}
            {propertyValue.hasOwnProperty("textFill") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Text Color</label>
                    <ColorDropdown currentColor={propertyValue.textFill} onChange={color => handlePropertyChange("textFill", color)} />
                </div>}
            {propertyValue.hasOwnProperty("textBackground") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Text Background Color</label>
                    <ColorDropdown currentColor={propertyValue.textBackground} onChange={color => handlePropertyChange("textBackground", color)} />
                </div>}
            {propertyValue.hasOwnProperty("background") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Background Color</label>
                    <ColorDropdown currentColor={propertyValue.background} onChange={color => handlePropertyChange("background", color)} />
                </div>}
            {propertyValue.hasOwnProperty("borderColor") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Border Color</label>
                    <ColorDropdown currentColor={propertyValue.borderColor} onChange={color => handlePropertyChange("borderColor", color)} />
                </div>}

            {/* {properties.includes("border") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Border Color</label>
                    <ColorDropdown currentColor={propertyValue.borderColor} onChange={handleBorderColorChange} />
                </div>}
                */}
            {propertyValue.hasOwnProperty("borderWidth") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Border width</label>
                    <input type="number"
                        value={propertyValue.borderWidth}
                        onChange={e => handlePropertyChange("borderWidth", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}

            {propertyValue.hasOwnProperty("borderCorner") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Border Corner radious</label>
                    <input type="number"
                        value={propertyValue.borderCorner}
                        onChange={e => handlePropertyChange("borderCorner", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}

            {propertyValue.hasOwnProperty("width") &&
                <div className='flex flex-col'>
                    <label htmlFor="">width</label>
                    <input type="number"
                        value={propertyValue.width}
                        onChange={e => handlePropertyChange("width", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("height") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Height</label>
                    <input type="number"
                        value={propertyValue.height}
                        onChange={e => handlePropertyChange("height", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("scaleX") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Zoom X</label>
                    <input type="number"
                        value={propertyValue.scaleX}
                        onChange={e => handlePropertyChange("scaleX", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("scaleY") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Zoom Y</label>
                    <input type="number"
                        value={propertyValue.scaleX}
                        onChange={e => handlePropertyChange("scaleY", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("skewX") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Zoom X</label>
                    <input type="number"
                        value={propertyValue.skewX}
                        onChange={e => handlePropertyChange("skewX", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("skewY") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Zoom Y</label>
                    <input type="number"
                        value={propertyValue.skewX}
                        onChange={e => handlePropertyChange("skewY", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("opacity") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Opacity</label>
                    <input type="range"
                        value={propertyValue.opacity * 100}
                        min={0}
                        max={100}
                        onChange={e => handlePropertyChange("opacity", parseInt(e.target.value) / 100)}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("rotaion") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Rotaion</label>
                    <input onFocus={e => e.target.select()} type="number"
                        value={propertyValue.rotaion}
                        onChange={e => handlePropertyChange("rotaion", parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("fontSize") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Font Size</label>
                    <input type="number"
                        value={propertyValue.fontSize}
                        onChange={e => handlePropertyChange("fontSize", parseInt(e.target.value))}
                        className=' text-center max-w-[4rem]'
                    />
                </div>}
            {propertyValue.hasOwnProperty("textAlign") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Text Align</label>
                    <select value={propertyValue.textAlign} className=' text-center max-w-[4rem]' onChange={e => handlePropertyChange("textAlign", (e.target.value))}>
                        <option value={"left"} >left</option>
                        <option value={"center"} >center</option>
                        <option value={"right"} >right</option>
                        <option value={"justify"} >justify</option>
                        <option value={"justify-left"} >justify-left</option>
                        <option value={"justify-center"} >justify-center</option>
                        <option value={"justify-right"} >justify-right</option>
                    </select>
                </div>}
            {propertyValue.hasOwnProperty("fontFamily") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Font Family</label>
                    <select value={propertyValue.fontFamily} className=' text-center max-w-[4rem]' onChange={e => handlePropertyChange("fontFamily", (e.target.value))}>
                        <option value={"Bangers"} >Bangers</option>
                        <option value={"Bitter"} >Bitter</option>
                        <option value={"Chakra Petch"} >Chakra Petch</option>
                        <option value={"Dancing Script"} >Dancing Script</option>
                        <option value={"Kanit"} >Kanit</option>
                        <option value={"Lobster"} >Lobster</option>
                        <option value={"Montserrat"} >Montserrat</option>
                        <option value={"Oswald"} >Oswald</option>
                        <option value={"Pacifico"} >Pacifico</option>
                        <option value={"Patrick Hand"} >Patrick Hand</option>
                        <option value={"Prompt"} >Prompt</option>
                        <option value={"Righteous"} >Righteous</option>
                        <option value={"Roboto"} >Roboto</option>
                        <option value={"Roboto Condensed"} >Roboto Condensed</option>
                        <option value={"Roboto Semi Condensed"} >Roboto Semi Condensed</option>
                        <option value={"Rock Salt"} >Rock Salt</option>
                        <option value={"Spectral SC"} >Spectral SC</option>

                        {/* <option value={"Roboto"} >Roboto</option>
                        <option value={"Chakra_Petch"} >Chakra_Petch</option>
                        <option value={"Prompt"} >Prompt</option>
                        <option value={"Kanit"} >Kanit</option>
                        <option value={"Spectral_SC"} >Spectral_SC</option>
                        <option value={"Bitter"} >Bitter</option>
                        <option value={"Roboto_Condensed"} >Roboto_Condensed</option>
                        <option value={"Bangers"} >Bangers</option>
                        <option value={"gf_Dancing_Script variant1"} >Dancing_Script</option>
                        <option value={"Lobster"} >Lobster</option>
                        <option value={"Oswald"} >Oswald</option>
                        <option value={"Pacifico"} >Pacifico</option>
                        <option value={"Patrick_Hand"} >Patrick_Hand</option>
                        <option value={"Righteous"} >Righteous</option>
                        <option value={"Rock_Salt"} >Rock_Salt</option>
                        <option value={"Montserrat"} >Montserrat</option> */}

                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Roboto  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Chakra_Petch  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Prompt  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Kanit  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Spectral_SC  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Bitter  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Roboto_Condensed  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Bangers  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Dancing_Script  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Lobster  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Oswald  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Pacifico  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Patrick_Hand  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Righteous  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Rock_Salt  */}
                        {/* c:\Users\VMM\Downloads\Bangers,Bitter,Chakra_Petch,Dancing_Script,Kanit,etc\Montserrat */}
                    </select>
                </div>}
            {/* {propertyValue.hasOwnProperty("borderSides") &&
                <div className='flex flex-col'>
                    <label htmlFor="">Rotaion</label>
                    <input type="checkbox"
                        value={propertyValue.borderSides}
                        onChange={_ => handlePropertyChange("borderSides", !propertyValue.borderSides)}
                        className='w-min text-center max-w-[4rem]'
                    />
                </div>} */}
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

                    {/* <label htmlFor="">Font weight</label> */}
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
                    {/* <label htmlFor="">Font Style</label> */}
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
                    {/* <label htmlFor="">Align</label> */}
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
                {/* {properties.includes("background") && <div className='flex flex-col'>
                    <label htmlFor="">Width</label>
                    <input type="number"
                        value={propertyValue.width}
                        onChange={e => handleWidthChange(parseInt(e.target.value))}
                        className='w-min text-center max-w-[4rem]'
                    //   onChange={(e) => chagneCanvasSetings(e.target.value)}
                    //    defaultValue={canvas?.width}
                    />
                </div>} */}
                <div className='flex flex-col'>
                    {/* <label htmlFor="">Height</label> */}
                    {/* <input type="number" value={canvasHeight} className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                </div>
            </div>
        </div>
    </>);
}

export default Properties;