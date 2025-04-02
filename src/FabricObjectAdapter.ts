import { Ellipse, FabricImage, FabricObject, Rect, Textbox, } from "fabric";
import { EllipseObj } from "./Objects/EllipseObj";
import { FabricImageObj } from "./Objects/FabricImageObj";
import { RectObj } from "./Objects/RectObj";
import { TextBoxObj } from "./Objects/TextBoxObj";

export class FabricObjectAdapter {
    static createAdapter(type: string, fbObj: FabricObject) {
        switch (type) {
            case "rect":
                return new RectObj(fbObj as Rect);

            case "ellipse":
                return new EllipseObj(fbObj as Ellipse);

            case "image":
                return new FabricImageObj(fbObj as FabricImage);

            case "textbox":
                return new TextBoxObj(fbObj as Textbox);

            default:
                throw new Error("Can not find the given object type " + type);
        }
    }
}