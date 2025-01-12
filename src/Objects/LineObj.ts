import { Line } from "fabric";
import { CustomFabric } from "./CustomFabric";

export class LineObj extends CustomFabric {
    obj: Line;
    constructor(obj: Line) {
        super(obj)
        this.obj = obj
    }
    setBackground(background: string): void {
        this.obj.set("fill", background);
    }
    setBorder(color: string): void {
        this.obj.set("stroke", color)

    }
    setHeight(_: string): void {

    }
    setOpacity(_: string): void {

    }
    setRotaion(_: string): void {

    }
    setWidth(_: string): void {

    }
}