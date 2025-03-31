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
    setBorderWidth(width: number): void {
        this.rectObj.set("strokeWidth", width)
    }
    setHeight(_height: number): void {

    }
    setOpacity(_: string): void {

    }
    setRotaion(_: string): void {

    }
    setWidth(width: number): void {
        this.rectObj.set("width", width)
    }
}