import { Rect } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { CustomFabric } from "./CustomFabric";

export class RectObj extends CustomFabric {
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


    public getObjectValues() {
        return {
            ...super.getObjectValues(),
            background: this.obj.fill,
            borderColor: this.obj.stroke,
            borderWidth: this.obj.strokeWidth,
            borderCorner: this.obj.rx,
            borderSides: this.obj.clipPath ? true : false
        }
    }
}