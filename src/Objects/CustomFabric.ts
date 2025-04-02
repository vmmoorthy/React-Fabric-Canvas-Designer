import { FabricObject } from "fabric";

export class CustomFabric {
    obj: FabricObject;
    propertyListMap: { [property: string]: any };
    constructor(obj: FabricObject,) {
        this.obj = obj;
        this.propertyListMap = { "rotaion": this.setRotaion, "opacity": this.setOpacity, "width": this.setWidth, "height": this.setHeight, }
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
    protected getObjectValues(): { width: number; height: number; opacity: number; rotaion: number; } {
        return { width: this.obj.width, height: this.obj.height, opacity: this.obj.opacity, rotaion: this.obj.angle }
    }
}