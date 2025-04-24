import { Ellipse, Line, Rect, Textbox } from "fabric";
import { EllipseObj } from "./EllipseObj";
import { LineObj } from "./LineObj";
import { RectObj } from "./RectObj";
import { TextBoxObj } from "./TextBoxObj";


describe("Fabric Object Wrappers", () => {
    test("RectObj should set and get properties", () => {
        const rect = new Rect();
        const rectObj = new RectObj(rect);

        rectObj.setBackground("red");
        expect(rectObj.obj.fill).toBe("red");

        rectObj.setBorderColor("blue");
        expect(rectObj.obj.stroke).toBe("blue");

        rectObj.setBorderWidth(5);
        expect(rectObj.obj.strokeWidth).toBe(5);
    });

    test("EllipseObj should set and get properties", () => {
        const ellipse = new Ellipse();
        const ellipseObj = new EllipseObj(ellipse);

        ellipseObj.setBackground("green");
        expect(ellipseObj.obj.fill).toBe("green");

        ellipseObj.setBorderColor("yellow");
        expect(ellipseObj.obj.stroke).toBe("yellow");

        ellipseObj.setBorderWidth(3);
        expect(ellipseObj.obj.strokeWidth).toBe(3);
    });

    test("LineObj should set and get properties", () => {
        const line = new Line();
        const lineObj = new LineObj(line);

        lineObj.setBorderColor("black");
        expect(lineObj.obj.stroke).toBe("black");

        lineObj.setBorderWidth(2);
        expect(lineObj.obj.strokeWidth).toBe(2);
    });

    // test("FabricImageObj should handle image properties", () => {
    //     const image = new FabricImage();
    //     const imageObj = new FabricImageObj(image);

    //     expect(imageObj.getObjectValues()).toBeDefined();
    // });

    test("TextBoxObj should set and get text properties", () => {
        const textbox = new Textbox("test");

        const textBoxObj = new TextBoxObj(textbox);

        textBoxObj.setFontFamily("Arial");
        expect(textBoxObj.obj.fontFamily).toBe("Arial");

        textBoxObj.setFontSize(20);
        expect(textBoxObj.obj.fontSize).toBe(20);

        textBoxObj.setTextFill("blue");
        expect(textBoxObj.obj.fill).toBe("blue");
    });
});
