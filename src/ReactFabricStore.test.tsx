import { Canvas, Point, Rect } from "fabric";
import { ReactFabricStore } from "./ReactFabricStore";


describe("ReactFabricStore", () => {
    let canvas: Canvas;
    let store: ReactFabricStore;
    let canvasElement: HTMLCanvasElement;

    beforeEach(() => {
        canvasElement = document.createElement('canvas');
        canvasElement.width = 800;
        canvasElement.height = 600;

        canvas = new Canvas(canvasElement);
        store = new ReactFabricStore({ fabricCanvasInstance: canvas, fontList: [] });
        store._.add(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        store._.renderAll()
    });

    test("should initialize with default tool as 'select'", () => {
        expect(store.selectedTool).toBe("select");
    });

    test("should add a rectangle to the canvas", () => {
        store.selectTool("rect");

        // store._.add(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        // const p: TPointerEventInfo<TPointerEvent> = 
        canvas.fire("mouse:down", { e: new MouseEvent("mousedown", { clientX: 0, clientY: 0 }), pointer: new Point(0, 0), absolutePointer: new Point(0, 0), viewportPoint: new Point(0, 0), scenePoint: new Point(0, 0) })
        canvas.fire("mouse:move", { e: new MouseEvent("mousemove", { clientX: 100, clientY: 100 }), pointer: new Point(0, 0), absolutePointer: new Point(100, 100), viewportPoint: new Point(0, 0), scenePoint: new Point(0, 0) })
        store._.renderAll()
        const objects = store._.getObjects();

        expect(objects.length).toBe(2);
        expect(objects[1].type).toBe("rect");
    });

    // test("should add a rectangle to the canvas", () => {
    //     store.selectTool("rect");

    //     // Simulate mouse down event
    //     const downEvent = { e: { clientX: 0, clientY: 0 } };
    //     const registeredHandlers: { [key: string]: Function } = {};
    //     (canvas.on as jest.Mock).mockImplementation((eventName, handler) => {
    //         registeredHandlers[eventName] = handler;
    //     });

    //     registeredHandlers["mouse:down"](downEvent);

    //     // Simulate mouse move
    //     const moveEvent = { e: { clientX: 100, clientY: 100 } };
    //     // registeredHandlers["mouse:move"](moveEvent);

    //     // Simulate mouse up
    //     registeredHandlers["mouse:up"](moveEvent);

    //     expect(canvas.add).toHaveBeenCalled();
    // });

    test("should update property values of selected objects", () => {
        const objs = canvas.getObjects()
        expect(objs.length).toBeGreaterThan(0)
        canvas.setActiveObject(objs[0])

        store.updatePropertyValue("opacity", 0.5);
        expect(objs[0].opacity).toBe(0.5);
    });

    test("should export and import canvas JSON", () => {
        const json = store.exportJSON();
        expect(json).toBeDefined();

        store.importJSON(json);
        expect(canvas.getObjects().length).toBeGreaterThan(0);
    });
});
