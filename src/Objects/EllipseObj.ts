import { Ellipse } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { FabricObjectPropertyList } from "../types/WrapperFabricType";
import { WrapperFabric } from "./WrapperFabric";

export class EllipseObj extends WrapperFabric {
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
        // if (!width)
        //     width = 0
        this.obj.set("strokeWidth", width)
        //this.obj.setCoords()
    }
    public getObjectValues(): FabricObjectPropertyList {
        return { ...super.getObjectValues(), background: { type: "color", value: this.obj.fill || "" }, borderColor: { type: "color", value: this.obj.stroke || "" }, borderWidth: { type: "number", step: 1, value: this.obj.strokeWidth } }
    }
}