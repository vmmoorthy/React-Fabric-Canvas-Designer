export function bindThisInAllObjFn(thisArg: any, obj: { [key: string]: any }) {
    for (const key in obj) {
        obj[key] = obj[key].bind(thisArg)
    }
}