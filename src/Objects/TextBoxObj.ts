import { Textbox } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { CustomFabric } from "./CustomFabric";

export class TextBoxObj extends CustomFabric {
    obj: Textbox;
    constructor(rectObj: Textbox) {
        super(rectObj)
        this.propertyListMap = {
            ...this.propertyListMap,
            "fontFamily": this.setFontFamily,
            "fontSize": this.setFontSize,
            "fontStyle": this.setFontStyle,
            "textAlign": this.setTextAlign,
            "textFill": this.setTextFill,
            "textBackground": this.setTextBackground,
            // "background": this.setBackground,
        }
        this.obj = rectObj
        bindThisInAllObjFn(this, this.propertyListMap)

    }
    setFontFamily(font: string): void {
        this.obj.set("fontFamily", font)
    }
    setFontStyle(_: string): void {

    }

    setFontSize(size: number): void {
        if (!size)
            size = 1
        this.obj.set("fontSize", size)
    }
    setTextAlign(alignMent: string): void {
        this.obj.set("textAlign", alignMent)
    }
    setTextFill(color: string): void {
        this.obj.set("fill", color)
    }
    setTextBackground(color: string): void {
        this.obj.set("textBackgroundColor", color)
        this.obj.set("backgroundColor", color);
    }
    // setBackground(background: string): void {
    //     this.obj.set("backgroundColor", background);
    //     //this.obj.setCoords()
    // }

    public getObjectValues() {
        return {
            ...super.getObjectValues(),
            fontFamily: this.obj.fontFamily,
            fontSize: this.obj.fontSize,
            textAlign: this.obj.textAlign,
            textFill: this.obj.fill,
            textBackground: this.obj.textBackgroundColor,
            // background: this.obj.backgroundColor,
        }
    }
}