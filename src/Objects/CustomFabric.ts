import { FabricObject } from "fabric";

export abstract class CustomFabric {
    obj: FabricObject;
    constructor(obj: FabricObject) {
        this.obj = obj;
    }

    abstract setWidth(number: string): void;
    abstract setHeight(number: string): void;
    abstract setRotaion(number: string): void;
    abstract setOpacity(number: string): void;
    // abstract setOpacity(number: string): void;
    abstract setBackground(type: string): void;
    abstract setBorder(type: string): void;
    // abstract setFill(type: string): void;
}