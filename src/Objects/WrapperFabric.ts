import { FabricObject } from "fabric";
import { FabricObjectPropertyList } from "./WrapperFabricType";


export class WrapperFabric {
    obj: FabricObject;
    propertyListMap: { [property: string]: any };
    constructor(obj: FabricObject,) {
        this.obj = obj;
        this.propertyListMap = {
            "rotaion": this.setRotaion, "opacity": this.setOpacity,
            "width": this.setWidth, "height": this.setHeight, "scaleX": this.setScaleX, "scaleY": this.setScaleY,
            "skewX": this.setSkewX, "skewY": this.setSkewY
        }
    }
    setWidth(width: number): void {
        // if (!width)
        //     width = 0
        this.obj.set("width", width)
    };
    setHeight(height: number): void {
        // if (!height)
        //     height = 0

        this.obj.set("height", height)
    };
    setRotaion(angle: number): void {
        // if (!angle)
        //     angle = 0
        this.obj.set("angle", angle)
    };
    setOpacity(opacity: number): void {
        this.obj.set("opacity", opacity)
    };
    setScaleX(scaleX: number): void {
        // if (!scaleX)
        //     scaleX = 1
        this.obj.set("scaleX", scaleX)
    };
    setScaleY(scaleY: number): void {
        // if (!scaleY)
        //     scaleY = 1
        this.obj.set("scaleY", scaleY)
    };
    setSkewX(skewX: number): void {
        // if (!skewX)
        //     skewX = 0
        this.obj.set("skewX", skewX)
    };
    setSkewY(skewY: number): void {
        // if (!skewY)
        //     skewY = 0
        this.obj.set("skewY", skewY)
    };
    protected getObjectValues(): FabricObjectPropertyList {
        return {
            skewX: { type: "number", step: 1, value: this.obj.skewX },
            skewY: { type: "number", step: 1, value: this.obj.skewY },
            // scaleX: { type: "number", min: 0, step: 1, value: this.obj.scaleX },
            // scaleY: { type: "number", min: 0, step: 1, value: this.obj.scaleY },
            // width: { type: "number", min: 0, step: 1, value: this.obj.width },
            // height: { type: "number", min: 0, step: 1, value: this.obj.height },
            opacity: { type: "range", min: 0, max: 1, step: 0.1, value: this.obj.opacity },
            rotaion: { type: "range", min: 0, max: 359, step: 1, value: this.obj.angle }
        }
    }
}