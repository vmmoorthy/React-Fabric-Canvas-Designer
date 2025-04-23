import { Line } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { WrapperFabric } from "./WrapperFabric";
import { FabricObjectPropertyList } from "./WrapperFabricType";

export class LineObj extends WrapperFabric {
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
        // if (!width)
        //     width = 0
        this.obj.set("strokeWidth", width)
        //this.obj.setCoords()
    }

    public getObjectValues(): FabricObjectPropertyList {
        return { ...super.getObjectValues(), borderColor: { type: "color", value: this.obj.stroke || "" }, borderWidth: { type: "number", step: 1, value: this.obj.strokeWidth } }
    }
}