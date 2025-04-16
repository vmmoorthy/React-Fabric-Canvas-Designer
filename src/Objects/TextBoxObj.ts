import { Textbox } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { CustomFabric } from "./CustomFabric";

export class TextBoxObj extends CustomFabric {
    obj: Textbox;
    constructor(textObj: Textbox) {
        super(textObj)
        // textObj.set("lockScalingX", true);
        textObj.set("lockScalingY", true);
        textObj.set("styles", {});
        textObj.setControlsVisibility({
            mt: false, // Middle top
            mb: false, // Middle bottom
            ml: true, // Middle left
            mr: true, // Middle right
            tl: false, // Top left
            tr: false, // Top right
            bl: false, // Bottom left
            br: false, // Bottom right
            mtr: true // Rotation control
        });

        this.propertyListMap = {
            ...this.propertyListMap,
            "fontFamily": this.setFontFamily,
            "fontSize": this.setFontSize,
            "fontStyle": this.setFontStyle,
            "fontWeight": this.setFontWeight,
            "textAlign": this.setTextAlign,
            "textFill": this.setTextFill,
            "textBackground": this.setTextBackground,
            // "background": this.setBackground,
        }
        this.obj = textObj
        bindThisInAllObjFn(this, this.propertyListMap)

    }
    setFontFamily(font: string): void {
        this.obj.set("fontFamily", font)
    }
    setFontStyle(style: string): void {
        this.obj.fontStyle = style
    }
    setFontWeight(weight: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"): void {
        this.obj.fontWeight = weight
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
            fontStyle: this.obj.fontStyle,
            fontWeight: this.obj.fontWeight,
            textAlign: this.obj.textAlign,
            textFill: this.obj.fill,
            textBackground: this.obj.textBackgroundColor,
            // background: this.obj.backgroundColor,
        }
    }
}