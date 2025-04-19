import { TFiller } from "fabric";

export type FabricObjectPropertyValueType = boolean | number | string | TFiller;
export type FabricObjectPropertyType = { type: "boolean" | "enum" | "number" | "string" | "color"; enum?: string[], min?: number; max?: number; value: FabricObjectPropertyValueType }
export type FabricObjectPropertyList = { [key: string]: FabricObjectPropertyType }