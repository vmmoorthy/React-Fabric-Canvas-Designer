import { Line } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { CustomFabric } from "./CustomFabric";

export class LineObj extends CustomFabric {
    obj: Line;
    constructor(obj: Line) {
        super(obj)
        this.propertyListMap = { ...this.propertyListMap, "borderColor": this.setBorderColor, "borderWidth": this.setBorderWidth, }
        this.obj = obj
        bindThisInAllObjFn(this, this.propertyListMap)
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
        return { ...super.getObjectValues(), borderColor: this.obj.stroke, borderWidth: this.obj.strokeWidth }
    }
}