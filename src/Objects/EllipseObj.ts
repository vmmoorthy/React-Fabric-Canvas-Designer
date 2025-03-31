import { Ellipse } from "fabric";
import { CustomFabric } from "./CustomFabric";

export class EllipseObj extends CustomFabric {
    ellipseObj: Ellipse;
    constructor(rectObj: Ellipse) {
        super(rectObj)
        this.ellipseObj = rectObj
    }
    setBackground(background: string): void {
        this.ellipseObj.set("textBackgroundColor", background)
    }
    setBorder(color: string): void {
        this.ellipseObj.set("stroke", color)

    }
    setHeight(_: number): void {

    }
    setOpacity(_: string): void {

    }
    setRotaion(_: string): void {

    }
    setWidth(width: number): void {
        this.ellipseObj.set("width", width)
    }
}