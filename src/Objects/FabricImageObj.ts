import { FabricImage } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { CustomFabric } from "./CustomFabric";

export class FabricImageObj extends CustomFabric {
    obj: FabricImage;
    constructor(rectObj: FabricImage) {
        super(rectObj)
        this.propertyListMap = { ...this.propertyListMap, "imageFit": this.setImageFit }
        this.obj = rectObj
        bindThisInAllObjFn(this, this.propertyListMap)
    }
    setImageFit(_: string) {

    }
    public getObjectValues() {
        return { ...super.getObjectValues(), imageFit: null }
    }
}