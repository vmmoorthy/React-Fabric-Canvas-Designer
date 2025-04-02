import { Ellipse } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { CustomFabric } from "./CustomFabric";

export class EllipseObj extends CustomFabric {
    obj: Ellipse;
    constructor(rectObj: Ellipse) {
        super(rectObj)
        this.propertyListMap = {
            ...this.propertyListMap,
            "background": this.setBackground,
            "borderColor": this.setBorderColor,
            "borderWidth": this.setBorderWidth,
        }
        this.obj = rectObj
        bindThisInAllObjFn(this, this.propertyListMap)
    }
    setBackground(background: string): void {
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
    public getObjectValues() {
        return { ...super.getObjectValues(), background: this.obj.fill, borderColor: this.obj.stroke, borderWidth: this.obj.strokeWidth }
    }
}