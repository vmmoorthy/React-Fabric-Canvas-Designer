import { FabricImage } from "fabric";
import { bindThisInAllObjFn } from "../helpers/helpers";
import { FabricObjectPropertyList } from "../types/WrapperFabricType";
import { WrapperFabric } from "./WrapperFabric";

export class FabricImageObj extends WrapperFabric {
    obj: FabricImage;
    constructor(rectObj: FabricImage) {
        super(rectObj)
        this.propertyListMap = { ...this.propertyListMap, "imageFit": this.setImageFit }
        this.obj = rectObj
        bindThisInAllObjFn(this, this.propertyListMap)
    }
    setImageFit(_: string) {

    }
    public getObjectValues(): FabricObjectPropertyList {
        return {
            ...super.getObjectValues(),
            // imageFit: null
        }
    }
}