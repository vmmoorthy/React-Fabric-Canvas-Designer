import { TFiller } from "fabric";

export type FabricObjectPropertyValueType = FabricObjectPropertyType extends { value: infer T } ? T : never;//boolean | number | string | TFiller;
export type FabricObjectPropertyType =
    { type: "range", min: number; max: number; step: number; value: number } |
    { type: "boolean"; value: boolean } |
    { type: "enum"; enum: string[], value: string } |
    { type: "font"; value: string } |
    { type: "number"; min?: number; step: number; value: number } |
    { type: "color"; value: string | TFiller }

export type FabricObjectPropertyList = { [key: string]: FabricObjectPropertyType }