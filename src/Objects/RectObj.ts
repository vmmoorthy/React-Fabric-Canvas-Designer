import { Rect } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { WrapperFabric } from "./WrapperFabric";
import { FabricObjectPropertyList } from "./WrapperFabricType";

export class RectObj extends WrapperFabric {
    obj: Rect;
    constructor(rectObj: Rect) {
        super(rectObj)
        this.obj = rectObj
        this.propertyListMap = {
            ...this.propertyListMap,
            "background": this.setBackground,
            "borderColor": this.setBorderColor,
            "borderWidth": this.setBorderWidth,
            "borderCorner": this.setBorderCorner,
            "borderSides": this.setBorderSides
        }
        bindThisInAllObjFn(this, this.propertyListMap)
    }
    setBackground(background: string): void {
        console.log(this, this.obj)
        this.obj.set("fill", background);
        //this.obj.setCoords()
    }
    setBorderColor(color: string): void {
        this.obj.set("stroke", color)
        //this.obj.setCoords()
    }
    setBorderWidth(width: number): void {
        if (!width)
            width = 0
        this.obj.set("strokeWidth", width)
        //this.obj.setCoords()
    }
    setBorderCorner(cornerRadious: number): void {
        if (!cornerRadious)
            cornerRadious = 0
        this.obj.set("rx", cornerRadious)
        this.obj.set("ry", cornerRadious)
        // this.obj.set("strokeWidth", width)
        // //this.obj.setCoords()
    }
    setBorderSides(val: boolean): void {
        // this.obj.set("strokeWidth", width)
        // //this.obj.setCoords()
        if (val)
            this.obj.set("clipPath", new Rect({
                left: 0,
                top: 0,
                width: 2, // Only show stroke on left side
                height: this.obj.height,
                absolutePositioned: true
            }))
        else
            this.obj.set("clipPath", null)
    }


    public getObjectValues(): FabricObjectPropertyList {
        return {
            ...super.getObjectValues(),
            background: { type: "color", value: this.obj.fill || "", },
            borderColor: { type: "color", value: this.obj.stroke || "", },
            borderWidth: { type: "number", step: 1, value: this.obj.strokeWidth, },
            borderCorner: { type: "number", step: 1, value: this.obj.rx, },
            borderSides: { type: "boolean", value: this.obj.clipPath ? true : false },
        }
    }
}