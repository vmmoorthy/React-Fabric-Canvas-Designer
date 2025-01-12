import { Rect } from "fabric";
import { CustomFabric } from "./CustomFabric";

export class RectObj extends CustomFabric {
    rectObj: Rect;
    constructor(rectObj: Rect) {
        super(rectObj)
        this.rectObj = rectObj
    }
    setBackground(background: string): void {
        this.rectObj.set("fill", background);
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