import { Ellipse } from "fabric";
import { CustomFabric } from "./CustomFabric";

export class EllipseObj extends CustomFabric {
    rectObj: Ellipse;
    constructor(rectObj: Ellipse) {
        super(rectObj)
        this.rectObj = rectObj
    }
    setBackground(background: string): void {
        this.rectObj.set("textBackgroundColor", background)
    }
    setBorder(color: string): void {
        this.rectObj.set("stroke", color)

    }
    setHeight(_: string): void {

    }
    setOpacity(_: string): void {

    }
    setRotaion(_: string): void {

    }
    setWidth(_: string): void {

    }
}