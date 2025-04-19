import { FabricObject } from "fabric";
import { FabricObjectPropertyList } from "./WrapperFabricType";


export class WrapperFabric {
    obj: FabricObject;
    propertyListMap: { [property: string]: any };
    constructor(obj: FabricObject,) {
        this.obj = obj;
        this.propertyListMap = { "rotaion": this.setRotaion, "opacity": this.setOpacity, "width": this.setWidth, "height": this.setHeight, "scaleX": this.setScaleX, "scaleY": this.setScaleY, "skewX": this.setSkewX, "skewY": this.setSkewY }
    }
    setWidth(width: number): void {
        if (!width)
            width = 0
        this.obj.set("width", width)
        //this.obj.setCoords()
    };
    setHeight(height: number): void {
        if (!height)
            height = 0

        this.obj.set("height", height)
        //this.obj.setCoords()
    };
    setRotaion(angle: number): void {
        if (!angle)
            angle = 0
        this.obj.set("angle", angle)
    };
    setOpacity(opacity: number): void {
        if (!opacity)
            opacity = 1
        this.obj.set("opacity", opacity)
        //this.obj.setCoords()
    };
    setScaleX(scaleX: number): void {
        if (!scaleX)
            scaleX = 1
        this.obj.set("scaleX", scaleX)
        //this.obj.setCoords()
    };
    setScaleY(scaleY: number): void {
        if (!scaleY)
            scaleY = 1
        this.obj.set("scaleY", scaleY)
        //this.obj.setCoords()
    };
    setSkewX(skewX: number): void {
        if (!skewX)
            skewX = 1
        this.obj.set("skewX", skewX)
        //this.obj.setCoords()
    };
    setSkewY(skewY: number): void {
        if (!skewY)
            skewY = 1
        this.obj.set("skewY", skewY)
        //this.obj.setCoords()
    };
    protected getObjectValues(): FabricObjectPropertyList {
        return {
            skewX: { type: "number", min: 0, max: undefined, value: this.obj.skewX },
            skewY: { type: "number", min: 0, max: undefined, value: this.obj.skewY },
            scaleX: { type: "number", min: 0, max: undefined, value: this.obj.scaleX },
            scaleY: { type: "number", min: 0, max: undefined, value: this.obj.scaleY },
            width: { type: "number", min: 0, max: undefined, value: this.obj.width },
            height: { type: "number", min: 0, max: undefined, value: this.obj.height },
            opacity: { type: "number", min: 0, max: 1, value: this.obj.opacity },
            rotaion: { type: "number", min: 0, max: 359, value: this.obj.angle }
        }
    }
}