import { FabricImage } from "fabric";
import { CustomFabric } from "./CustomFabric";

export class FabricImageObj extends CustomFabric {
    imageObj: FabricImage;
    constructor(rectObj: FabricImage) {
        super(rectObj)
        this.imageObj = rectObj
    }
    setBackground(background: string): void {
        this.imageObj.set("textBackgroundColor", background)
    }
    setBorder(color: string): void {
        this.imageObj.set("stroke", color)

    }
    setHeight(_: number): void {

    }
    setOpacity(_: string): void {

    }
    setRotaion(_: string): void {

    }
    setWidth(width: number): void {
        this.imageObj.set("width", width)
    }
}