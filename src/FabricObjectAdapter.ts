import { FabricObject, Rect, } from "fabric";
import { RectObj } from "./Objects/RectObj";

export class FabricObjectAdapter {
    static createAdapter(type: string, fbObj: FabricObject) {
        switch (type) {
            case "rect":
                return new RectObj(fbObj as Rect)
            default:
                throw new Error("Can not find the given object type " + type);
        }
    }
}