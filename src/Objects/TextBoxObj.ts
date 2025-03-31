import { Textbox } from "fabric";
import { CustomFabric } from "./CustomFabric";

export class TextBoxObj extends CustomFabric {
    textObj: Textbox;
    constructor(rectObj: Textbox) {
        super(rectObj)
        this.textObj = rectObj
    }
    setBackground(background: string): void {
        this.textObj.set("textBackgroundColor", background)
    }
    setBorder(color: string): void {
        this.textObj.set("stroke", color)

    }
    setHeight(_: number): void {

    }
    setOpacity(_: string): void {

    }
    setRotaion(_: string): void {

    }
    setWidth(width: number): void {
        this.textObj.set("width", width)
    }
}