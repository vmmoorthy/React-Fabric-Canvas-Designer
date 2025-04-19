import * as fabric from 'fabric';
import { Canvas, Ellipse, FabricImage, Rect, Textbox } from 'fabric';
import JSZip from "jszip";
import { QRCodeCanvas } from 'qrcode.react';
import { forwardRef, FunctionComponent, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { fonts } from './helpers/fonts.js';

export { default as Properties } from './Properties.js';
export { Canvas };

let altKeyFired = false;
interface CanvasComponentProps {
    initialValue: string
    templateRef: RefObject<HTMLInputElement>
    commmunicate: RefObject<{ retrive: Function }>
    parentCanvasRef: React.Dispatch<SetStateAction<Canvas>>
    listEmbeddings: {
        title: string;
        value: string;
    }[]
}

type toolType = "select" | "img" | "rect" | "elipse" | "text"
type objPositionType = "left" | "right" | "top" | "bottom" | "horizontally" | "vertically"
type objMoveType = 1 | 2 | -1 | -2

// const link = document.createElement("link");
// link.href = "https://fonts.googleapis.com/css2?family=Bangers&family=Bitter:ital,wght@0,100..900;1,100..900&family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Dancing+Script:wght@400..700&family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lobster&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Oswald:wght@200..700&family=Pacifico&family=Patrick+Hand&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Righteous&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rock+Salt&family=Spectral+SC:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap";
// link.rel = "stylesheet";
// link.onload = () => {
//     console.warn("Google Font has loaded!");
// };
// document.head.appendChild(link);

async function loadFonts() {
    try {

        const response = await fetch("/fonts.zip"); // Download ZIP file
        const blob = await response.blob();

        const zip = await JSZip.loadAsync(blob);
        // const fontPromises = [];
        // TODO: handle missing fonts 
        const fontPromises = fonts.map(async ({ name, src, weight, style }) => {
            // src = await import('./' + src.replace('.ttf', '') + '.ttf', { assert: { type: 'ttf' } })
            const fontBlob = await zip.files[src].async("blob");
            const fontUrl = URL.createObjectURL(fontBlob);
            const fontFace = new FontFace(name, `url('${fontUrl}')`, { weight: weight.toString(), style });
            document.fonts.add(fontFace);
            return fontFace.load();
        });
        await Promise.all(fontPromises);
    } catch (error) {
        console.error(error);
    }
    // for (const fileName of Object.keys(zip.files)) {
    //     if (fileName.endsWith(".ttf")) {

    //         const fontBlob = await zip.files[fileName].async("blob");
    //         const fontUrl = URL.createObjectURL(fontBlob);

    // const fontName = fileName.replace(/fonts\/|.ttf/g, ""); // Extract font name
    // console.log(fontName);
    // const fontFace = new FontFace(fontName, `url('${fontUrl}')`);

    // fontPromises.push(
    //     fontFace.load().then(() => {
    //         document.fonts.add(fontFace);
    //         console.log(`Loaded font: ${fontName}`);
    //     })
    // );
    //     }
    // }

    // await Promise.all(fontPromises);
    // console.log("All fonts loaded!");
}

loadFonts().catch(console.error);


// async function loadFonts() {
//     try {

//         const fontPromises = fonts.map(async ({ name, src, weight, style }) => {
//             // src = await import('./' + src.replace('.ttf', '') + '.ttf', { assert: { type: 'ttf' } })
//             const fontFace = new FontFace(name, `url('fonts/${src}')`, { weight: weight.toString(), style });
//             document.fonts.add(fontFace);
//             return fontFace.load();
//         });
//         await Promise.all(fontPromises);
//         console.log("All fonts loaded successfully");
//     } catch (error) {
//         console.log("fonts Couldn't load", error);

//     }
// }

// loadFonts().catch(console.error);


const CanvasComponent: FunctionComponent<CanvasComponentProps> = ({ initialValue, templateRef, commmunicate, parentCanvasRef, listEmbeddings = [] }) => {
    const [canvas, setCanvas] = useState<Canvas>(() => new Canvas());
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [currentStateIndex, setCurrentStateIndex] = useState(-1);
    const MAX_HISTORY = 50;
    const paintInfoRef = useRef({ isDrawing: false, drawColor: "black", backgroundColor: "white", isLoadingJson: false })
    const toolRef = useRef("select")
    const [initialData] = useState(initialValue)

    const cloneObjRef = useRef<fabric.FabricObject<Partial<fabric.FabricObjectProps>, fabric.SerializedObjectProps, fabric.ObjectEvents>[]>([])
    const clonedObjsRef = useRef<Set<fabric.FabricObject<Partial<fabric.FabricObjectProps>, fabric.SerializedObjectProps, fabric.ObjectEvents>>>(new Set([]))
    const [{ canvasWidth, canvasHeight, canvasBackgroundColor }, setCanvasProperties] = useState({ canvasWidth: 1056, canvasHeight: 816, canvasBackgroundColor: "white" });
    const toolProperties = useRef({ fontSize: 16, borderWidth: 0, fontFamily: "Arial", fontWeight: "bold", fontStyle: "normal", underline: false, stroke: "#0000", alignment: "left", fill: "#000000ff", backgroundColor: "#ffffffff", textAlign: "left", textBackgroundColor: "#ffffffff" }).current;
    const [tool, sTool] = useState<toolType>("select");

    const setTool = (tool: toolType) => {
        toolRef.current = tool
        sTool(tool)
    }
    useEffect(() => {
        // if (!canvas) return
        const activeObj = canvas.getActiveObject()
        if (!activeObj) return;
        // activeObj.fontSize = toolProperties.fontSize
        activeObj.set("fontSize", toolProperties.fontSize)
        activeObj.set("fontWeight", toolProperties.fontWeight)
        activeObj.set("fontFamily", toolProperties.fontFamily)
        activeObj.set("fontStyle", toolProperties.fontStyle)
        activeObj.set("textAlign", toolProperties.textAlign)
        activeObj.set("textBackgroundColor", toolProperties.textBackgroundColor)
        if (activeObj.type !== "textbox")
            activeObj.set("stroke", toolProperties.stroke)
        canvas.renderAll()
        console.log(activeObj);

    }, [toolProperties])
    useEffect(() => {
        // if (!canvas) return;
        parentCanvasRef(canvas)
        retrive(initialData)
        if (commmunicate.current)
            commmunicate.current.retrive = retrive
    }, [parentCanvasRef, canvas])
    useEffect(() => {
        // if (!canvas) return;
        // Initialize Fabric.js canvas

        console.log(canvas);


        let obj, origX: number, origY: number;


        // Handle mouse click to create rectangle
        canvas.on('mouse:down', (options) => {
            if (toolRef.current === "select") {
                cloneObjRef.current = canvas.getActiveObjects()
                return
            };

            paintInfoRef.current.isDrawing = true
            if (options.e) {
                const pointer = canvas.getPointer(options.e);
                origX = pointer.x
                origY = pointer.y
                if (toolRef.current == "rect")
                    obj = new Rect({
                        left: origX,
                        top: origY,
                        fill: paintInfoRef.current.drawColor, // Default fill color
                        stroke: "red",
                        strokeWidth: 1,
                        borderColor: "blue",
                        width: 0,
                        height: 0,
                        selectable: true,

                        originX: "left",
                        originY: "top",
                        // strokeWidth: 1,

                    });
                else if (toolRef.current == "elipse")
                    obj = new Ellipse({
                        left: origX,
                        top: origY,
                        fill: paintInfoRef.current.drawColor, // Default fill color
                        stroke: "red",
                        strokeWidth: 1,
                        borderColor: "blue",
                        rx: 0,
                        ry: 0,
                        selectable: true,

                        originX: "center",
                        originY: "center",
                        // strokeWidth: 1,

                    });
                else
                    obj = new Textbox("", {
                        left: origX,
                        top: origY,
                        fill: paintInfoRef.current.drawColor, // Default fill color
                        // stroke: "red",
                        // strokeWidth: 1,
                        // borderColor: "blue",
                        selectable: true,
                        originX: "right",
                        originY: "top",
                        // strokeWidth: 1,
                        // cli
                        width: 0,
                        height: 0,
                        fontSize: 20,
                        lockScalingY: true,


                    });
                obj.set("wrap", "char")
                obj.set({ "strokeUniform": true });
                canvas.add(obj);
                canvas.setActiveObject(obj);

            }
            canvas.renderAll()


        });

        // canvas.on("key")

        canvas.on('mouse:move', (options) => {

            // console.log(options.e.altKey, options.e.repeat)
            if (options.e.altKey) {
                if (!altKeyFired)
                    cloneObjRef.current.forEach(async ele => {
                        const clonedEle = await ele.clone();
                        console.log(clonedEle);

                        const clonedObjsSize = clonedObjsRef.current.size;
                        clonedObjsRef.current.add(clonedEle)
                        if (clonedObjsSize !== clonedObjsRef.current.size)
                            canvas.add(clonedEle)
                    })
                altKeyFired = true
            } else {
                // Remove the draw element
                altKeyFired = false
                clonedObjsRef.current.clear()

            }
            if (!paintInfoRef.current.isDrawing) return;
            // console.log(options);
            const pointer = canvas.getPointer(options.e);
            let x = pointer.x, y = pointer.y;

            if (x > canvasWidth || y > canvasHeight || x < 0 || y < 0) return

            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                if (toolRef.current == "rect")
                    activeObject.set({
                        width: Math.abs(pointer.x - origX),
                        height: Math.abs(pointer.y - origY),
                        left: Math.min(origX, pointer.x),
                        top: Math.min(origY, pointer.y)
                    });
                else if (toolRef.current == "elipse")
                    activeObject.set({
                        rx: Math.abs(pointer.x - origX),
                        ry: Math.abs(pointer.y - origY),
                        left: Math.min(origX, pointer.x),
                        top: Math.min(origY, pointer.y)
                    });
                else
                    activeObject.set({
                        width: Math.abs(pointer.x - origX)
                    })
                activeObject.setCoords();
                canvas.renderAll();
            }
        });

        canvas.on('mouse:up', (_) => {
            paintInfoRef.current.isDrawing = false
            if (toolRef.current == "text") {
                const activeObject = canvas.getActiveObject();
                if (activeObject)
                    (activeObject as Textbox).enterEditing()
            }


            setTool("select")

            canvas.renderAll()

        });


        canvas?.on("object:rotating", (e) => {
            if (e.e.shiftKey) {
                const obj = e.target;
                const angle = obj.angle; // Snap the angle to the nearest multiple of 45 
                const snappedAngle = Math.round(angle / 45) * 45;
                if (obj.originX !== "center")
                    obj.set('originX', "center");
                if (obj.originY !== "center")
                    obj.set('originY', "center");
                console.log(snappedAngle);
                if (obj.angle !== snappedAngle)
                    obj.set('angle', snappedAngle);
                canvas.renderAll();
            }
        })

        window.addEventListener('paste', handlePaste);

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('paste', handlePaste);
            canvas.off("object:rotating")
            canvas.off("mouse:down")
            canvas.off("mouse:move")
            canvas.off("mouse:up")

            canvas.dispose();

        };
    }, [canvas]);


    const handlePaste = function (e: ClipboardEvent) {
        console.log(e);

        if (!e.clipboardData) return;
        var items = e.clipboardData.items;
        console.log(items);

        for (var i = 0; i < items.length; i++) {
            console.log(items[i]);

            if (items[i].type === 'image/svg+xml') {
                items[i].getAsString(function (svgString: string) {
                    // Parse SVG content
                    var parser = new DOMParser();
                    var svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
                    var svgElement = svgDoc.documentElement;

                    // Ensure SVG has dimensions
                    if (!svgElement.hasAttribute('width')) {
                        svgElement.setAttribute('width', '100%');
                    }
                    if (!svgElement.hasAttribute('height')) {
                        svgElement.setAttribute('height', '100%');
                    }

                    // Convert SVG to data URL
                    var serializer = new XMLSerializer();
                    var svgStr = serializer.serializeToString(svgElement);
                    var svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));

                    // Create image from SVG
                    var img = new Image();
                    img.onload = function () {
                        loadImgToCanvas(img);
                    };
                    img.src = svgUrl;
                });
            }

            if (items[i].type.indexOf('image') !== -1) {
                var blob = items[i].getAsFile();
                var reader = new FileReader();
                reader.onload = function (event) {
                    var imgObj = new Image();
                    imgObj.src = (event.target?.result || "") as string;
                    console.log(imgObj);

                    imgObj.onload = function () {
                        loadImgToCanvas(imgObj)
                    }
                };
                reader.readAsDataURL(blob as Blob);
            }
        }
    }

    // Keep your existing loadImgToCanvas function
    const loadImgToCanvas = (imgElement: HTMLImageElement, e?: React.ChangeEvent<HTMLInputElement>) => {

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        let imgWidth = imgElement.naturalWidth;
        let imgHeight = imgElement.naturalHeight;

        if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
            const widthRatio = canvasWidth / imgWidth;
            const heightRatio = canvasHeight / imgHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            imgWidth *= ratio;
            imgHeight *= ratio;
        }

        const imgInstance = new FabricImage(imgElement, {
            left: 100,
            top: 100,
            selectable: true,
            scaleX: imgWidth / imgElement.naturalWidth,
            scaleY: imgHeight / imgElement.naturalHeight
        });

        canvas.add(imgInstance);
        canvas.renderAll();

        if (e) e.target.value = "";
    };

    useEffect(() => {

        console.log(canvasEl.current);
        const initcanvas: { obj: null | Canvas } = { obj: null }
        const handler = () => {
            if (!initcanvas.obj) return;;
            console.log("handler", paintInfoRef.current.isLoadingJson, initcanvas.obj);

            if (!paintInfoRef.current.isLoadingJson)
                saveCanvasState(initcanvas.obj)
        }

        const loadFonts = async () => {

            if (!canvasEl.current) return;

            initcanvas.obj = new Canvas(canvasEl.current, {
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: 'white',
                preserveObjectStacking: true
            });
            setCanvas(initcanvas.obj)

            initcanvas.obj.on("object:added", handler)
            initcanvas.obj.on('object:modified', handler);
            initcanvas.obj.on('object:removed', handler);

        };

        loadFonts();
        return () => {
            if (!initcanvas.obj) return;
            initcanvas.obj.off("object:added", handler)
            initcanvas.obj.off("object:modified", handler)
            initcanvas.obj.off("object:removed", handler)
            initcanvas.obj.dispose()
        }
    }, [])

    const saveCanvasState = (canvas: Canvas) => {
        console.log(history.length);
        if (history.length >= MAX_HISTORY) {
            history.shift();
            setCurrentStateIndex((prev) => {
                console.log(prev);

                return prev - 1
            });
        }
        if (currentStateIndex < history.length - 1) {
            setHistory(prev => [...prev.slice(0, currentStateIndex + 1), canvas.toJSON()]);
        } else {
            setHistory(prev => [...prev, canvas.toJSON()]);
        }
        setCurrentStateIndex((prev) => {
            console.log(prev);

            return prev + 1
        });
    };
    const undo = async () => {
        if (currentStateIndex > 0) {
            const previousState = history[currentStateIndex - 1];
            console.log(history, previousState, currentStateIndex);

            setCurrentStateIndex((prev) => prev - 1);
            if (previousState)
                await loadJson(previousState);
            canvas.renderAll()
        }
    };
    const redo = async () => {
        if (currentStateIndex < history.length - 1) {
            const nextState = history[currentStateIndex + 1];
            setCurrentStateIndex((prev) => prev + 1);
            await loadJson(nextState);
            canvas.renderAll()
        }
    };

    const handleFileUploads = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);

        if (!e.target.files || e.target.files.length <= 0) {
            return;
        }

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // setBgImgSrc((reader.result as string) || "");
            const imgElement = new Image();
            imgElement.src = (reader.result || "") as string;
            imgElement.onload = () => loadImgToCanvas(imgElement, e)
        };
        reader.readAsDataURL(file);
    }


    const handleKeyDown = (e: KeyboardEvent) => {
        // if (!canvas) return;

        if (e.key == "Alt" || e.key == "Shift") return
        console.log(e.key, e);

        const activeObjects = canvas.getActiveObjects() || [];
        if (activeObjects.length === 0) return
        if (activeObjects[0].isMoving) {
            e.preventDefault()
            return;
        }
        if (activeObjects[0].type == "textbox" && (activeObjects[0] as Textbox).isEditing) return
        // if (e.key == "Alt")
        // cloneObjRef.current = activeObjects

        canvas.discardActiveObject()
        activeObjects.forEach(activeObject => {
            switch (e.key) {
                case "Delete":
                    if (activeObject) {
                        canvas.remove(activeObject);
                    }
                    break;
                case "z":
                    if (e.ctrlKey) {
                        e.preventDefault()
                        undo()
                    }
                    break;
                case "r":
                    if (e.ctrlKey) {
                        e.preventDefault()
                        redo()
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault()
                    activeObject.setRelativeY(activeObject.top - 1)

                    break;
                case "ArrowDown":
                    e.preventDefault()
                    activeObject.setRelativeY(activeObject.top + 1)

                    break;
                case "ArrowLeft":
                    e.preventDefault()
                    activeObject.setRelativeX(activeObject.left - 1)

                    break;
                case "ArrowRight":
                    e.preventDefault()
                    activeObject.setRelativeX(activeObject.left + 1)

                    break;
            }
        })
        canvas.setActiveObject(new fabric.ActiveSelection(activeObjects))
        canvas.renderAll();
    };


    const moveObject = (val: objMoveType) => {
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        switch (val) {
            case 2:
                canvas.bringObjectToFront(activeObject)
                break;
            case 1:
                canvas.bringObjectForward(activeObject)
                break;
            case -1:
                canvas.sendObjectBackwards(activeObject)
                break;
            case -2:
                canvas.sendObjectToBack(activeObject)
                break;
        }
        canvas.renderAll();
    }
    const alignObject = (val: objPositionType) => {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length < 1) return;
        canvas.discardActiveObject()
        activeObjects.forEach(activeObject => {
            activeObject.set("zoomX", 1)
            activeObject.set("zoomY", 1)
            switch (val) {
                case "left":
                    activeObject.set("originX", "left")
                    activeObject.setX(0)
                    break;
                case "right":
                    activeObject.set("originX", "left")
                    activeObject.setX(canvas.width - activeObject.width * activeObject.scaleX)
                    break;
                case "top":
                    activeObject.set("originY", "top")
                    activeObject.setY(0)
                    break;
                case "bottom":
                    activeObject.set("originY", "top")
                    activeObject.setY(canvas.height - activeObject.height * activeObject.scaleY)
                    break;
                case "horizontally":
                    canvas.centerObjectH(activeObject)
                    break;
                case "vertically":
                    canvas.centerObjectV(activeObject)
                    break;
            }
        })
        canvas.setActiveObject(new fabric.ActiveSelection(activeObjects))
        canvas.renderAll();
    }

    // const getJsonData = () => {
    //     const json = JSON.stringify({ ...canvas.toJSON(), background: canvasBackgroundColor, canvasWidth, canvasHeight });
    //     return json
    //     // localStorage.setItem("canvasJSON", json)
    // }
    const loadJson = async (json: Object) => {
        // if (!canvas) return;
        paintInfoRef.current.isLoadingJson = true
        await canvas.loadFromJSON(json);
        paintInfoRef.current.isLoadingJson = false

    }
    const retrive = async (data: string) => {
        console.log(data);
        // if (!canvas) return;
        canvas.clear()
        const json = JSON.parse(data || "{}"); //|| localStorage.getItem("canvasJSON") 
        await loadJson(json)
        canvas.renderAll()
        chagneCanvasSetings(json?.canvasWidth || 1056, json?.canvasHeight || 816)
        saveCanvasState(canvas);


    }
    const chagneCanvasSetings = (width: number, height: number, bgcolor = undefined) => {
        // console.log(canvas);
        // if (!canvas) return;
        let cWidth = canvasWidth, cHeight = canvasHeight, cBackgroundColor = canvasBackgroundColor;
        if (width) {
            cWidth = Number(width)
            // canvasHeight = Math.abs(canvasWidth * 17 / 22)
            // canvas.setWidth(width)
        }
        if (height) {
            cHeight = Number(height)
            // canvasWidth = Math.abs(canvasHeight * 22 / 17)


            // canvas.setDimensions({ width: canvasWidth, height: height })
            // canvas.setHeight(height)
        }
        if (bgcolor)
            cBackgroundColor = bgcolor
        // console.log(width, height, canvasWidth, canvasHeight);
        setCanvasProperties({ canvasWidth: cWidth, canvasHeight: cHeight, canvasBackgroundColor: cBackgroundColor })
        canvas.setDimensions({ width: cWidth, height: cHeight, })
        // canvas.renderAll()
    }

    return (
        <div >
            <div className='m-auto w-full p-4 gap-10 flex justify-center'>
                <div>
                    <div className='flex justify-center items-center'>
                        <div className="tools shadow gap-2 p-3 w-min  my-2 mx-auto justify-center flex">
                            <button title='Bring to front' onClick={() => moveObject(2)}>
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.20825 3.125H19.7916M18.7499 13.5417L12.4999 7.29167M12.4999 7.29167L6.24992 13.5417M12.4999 7.29167V21.875" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button title='Bring Forward' onClick={() => moveObject(1)}>
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 21.875V3.64581" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19.7916 10.4167L12.4999 3.125L5.20825 10.4167" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button title='Send backward' onClick={() => moveObject(-1)}>
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 3.12502V21.3542" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19.7916 14.5833L12.4999 21.875L5.20825 14.5833" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button title='Send to back' onClick={() => moveObject(-2)}>
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.20825 21.875H19.7916M18.7499 11.4583L12.4999 17.7083M12.4999 17.7083L6.24992 11.4583M12.4999 17.7083V3.125" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="tools shadow gap-2 p-3 w-min  my-2 mx-auto justify-center flex">

                            <button title='Undo (Ctrl + Z)' onClick={() => undo()}>
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.84375 3.61459C7.99006 3.76107 8.07223 3.95964 8.07223 4.16667C8.07223 4.3737 7.99006 4.57227 7.84375 4.71875L6.05209 6.51042H15.625C17.2135 6.51042 18.737 7.14146 19.8603 8.26473C20.9835 9.38799 21.6146 10.9115 21.6146 12.5C21.6146 14.0885 20.9835 15.612 19.8603 16.7353C18.737 17.8585 17.2135 18.4896 15.625 18.4896H8.33334C8.12614 18.4896 7.92742 18.4073 7.78091 18.2608C7.6344 18.1143 7.55209 17.9155 7.55209 17.7083C7.55209 17.5011 7.6344 17.3024 7.78091 17.1559C7.92742 17.0094 8.12614 16.9271 8.33334 16.9271H15.625C16.7991 16.9271 17.9252 16.4607 18.7554 15.6304C19.5857 14.8002 20.0521 13.6741 20.0521 12.5C20.0521 11.3259 19.5857 10.1998 18.7554 9.36958C17.9252 8.53934 16.7991 8.07292 15.625 8.07292H6.05209L7.84375 9.86459C7.92051 9.93611 7.98208 10.0224 8.02478 10.1182C8.06748 10.214 8.09044 10.3175 8.09229 10.4224C8.09414 10.5273 8.07484 10.6315 8.03555 10.7288C7.99626 10.826 7.93777 10.9144 7.86359 10.9886C7.7894 11.0628 7.70103 11.1213 7.60375 11.1605C7.50647 11.1998 7.40228 11.2191 7.29738 11.2173C7.19248 11.2154 7.08903 11.1925 6.99319 11.1498C6.89736 11.1071 6.81111 11.0455 6.73959 10.9688L3.61459 7.84375C3.46829 7.69727 3.38611 7.4987 3.38611 7.29167C3.38611 7.08464 3.46829 6.88607 3.61459 6.73959L6.73959 3.61459C6.88607 3.46829 7.08464 3.38611 7.29167 3.38611C7.4987 3.38611 7.69727 3.46829 7.84375 3.61459Z" fill="black" />
                                </svg>
                            </button>
                            <button title='Redo (Ctrl + R)' onClick={() => redo()}>
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.1562 3.61459C17.0099 3.76107 16.9278 3.95964 16.9278 4.16667C16.9278 4.3737 17.0099 4.57227 17.1562 4.71875L18.9479 6.51042H9.375C7.78646 6.51042 6.26299 7.14146 5.13972 8.26473C4.01646 9.38799 3.38541 10.9115 3.38541 12.5C3.38541 14.0885 4.01646 15.612 5.13972 16.7353C6.26299 17.8585 7.78646 18.4896 9.375 18.4896H16.6667C16.8739 18.4896 17.0726 18.4073 17.2191 18.2608C17.3656 18.1143 17.4479 17.9155 17.4479 17.7083C17.4479 17.5011 17.3656 17.3024 17.2191 17.1559C17.0726 17.0094 16.8739 16.9271 16.6667 16.9271H9.375C8.20086 16.9271 7.07482 16.4607 6.24458 15.6304C5.41434 14.8002 4.94791 13.6741 4.94791 12.5C4.94791 11.3259 5.41434 10.1998 6.24458 9.36958C7.07482 8.53934 8.20086 8.07292 9.375 8.07292H18.9479L17.1562 9.86459C17.0795 9.93611 17.0179 10.0224 16.9752 10.1182C16.9325 10.214 16.9096 10.3175 16.9077 10.4224C16.9059 10.5273 16.9252 10.6315 16.9645 10.7288C17.0037 10.826 17.0622 10.9144 17.1364 10.9886C17.2106 11.0628 17.299 11.1213 17.3962 11.1605C17.4935 11.1998 17.5977 11.2191 17.7026 11.2173C17.8075 11.2154 17.911 11.1925 18.0068 11.1498C18.1026 11.1071 18.1889 11.0455 18.2604 10.9688L21.3854 7.84375C21.5317 7.69727 21.6139 7.4987 21.6139 7.29167C21.6139 7.08464 21.5317 6.88607 21.3854 6.73959L18.2604 3.61459C18.1139 3.46829 17.9154 3.38611 17.7083 3.38611C17.5013 3.38611 17.3027 3.46829 17.1562 3.61459Z" fill="black" />
                                </svg>
                            </button>
                        </div>
                        <div className="tools shadow gap-2 p-3 w-min rounded-md max-h-min  my-2 mx-auto justify-center flex">
                            <button title='select' style={{ borderRadius: "8px", background: tool === "select" ? "#5555ff" : undefined }} onClick={() => setTool("select")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.27254 0.463265C4.08937 0.451781 3.90591 0.480776 3.73521 0.548189C3.5645 0.615602 3.41073 0.719779 3.28483 0.853319C3.15893 0.98686 3.06397 1.14649 3.00672 1.32086C2.94946 1.49524 2.93131 1.68008 2.95354 1.86226L4.84279 22.134C4.96354 23.1185 6.12704 23.5773 6.88679 22.9398L10.8735 19.7068L12.661 22.803C13.689 24.5835 15.32 25.021 17.1005 23.993C18.881 22.965 19.318 21.3335 18.29 19.553L16.5088 16.468L21.2328 14.657C22.1648 14.3178 22.3495 13.0805 21.5578 12.4838L4.94604 0.711765C4.7506 0.564815 4.5166 0.478416 4.27254 0.463265Z" fill={tool === "select" ? "white" : "black"} />
                            </svg>
                            </button>
                            <button title='Rectangle' style={{ borderRadius: "8px", background: tool === "rect" ? "#5555ff" : undefined }} onClick={() => setTool("rect")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.7917 4.16666H5.20837C4.37957 4.16666 3.58472 4.4959 2.99867 5.08195C2.41261 5.668 2.08337 6.46286 2.08337 7.29166V17.7083C2.08337 18.5371 2.41261 19.332 2.99867 19.918C3.58472 20.5041 4.37957 20.8333 5.20837 20.8333H19.7917C20.6205 20.8333 21.4154 20.5041 22.0014 19.918C22.5875 19.332 22.9167 18.5371 22.9167 17.7083V7.29166C22.9167 6.46286 22.5875 5.668 22.0014 5.08195C21.4154 4.4959 20.6205 4.16666 19.7917 4.16666Z" fill={tool === "rect" ? "white" : "black"} />
                            </svg>
                            </button>
                            <button title='Elipse' style={{ borderRadius: "8px", background: tool === "elipse" ? "#5555ff" : undefined }} onClick={() => setTool("elipse")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5 22.9167C11.0591 22.9167 9.7049 22.6431 8.43754 22.0958C7.17018 21.5486 6.06775 20.8066 5.13025 19.8698C4.19275 18.933 3.45074 17.8306 2.90421 16.5625C2.35768 15.2945 2.08407 13.9403 2.08338 12.5C2.08268 11.0597 2.35629 9.70557 2.90421 8.43751C3.45213 7.16945 4.19414 6.06702 5.13025 5.13022C6.06636 4.19341 7.16879 3.4514 8.43754 2.90418C9.70629 2.35695 11.0605 2.08334 12.5 2.08334C13.9396 2.08334 15.2938 2.35695 16.5625 2.90418C17.8313 3.4514 18.9337 4.19341 19.8698 5.13022C20.8059 6.06702 21.5483 7.16945 22.0969 8.43751C22.6455 9.70557 22.9188 11.0597 22.9167 12.5C22.9146 13.9403 22.641 15.2945 22.0959 16.5625C21.5507 17.8306 20.8087 18.933 19.8698 19.8698C18.9309 20.8066 17.8285 21.549 16.5625 22.0969C15.2966 22.6448 13.9424 22.9181 12.5 22.9167Z" fill={tool === "elipse" ? "white" : "black"} />
                            </svg>
                            </button>
                            <button title='Text' style={{ borderRadius: "8px", background: tool === "text" ? "#5555ff" : undefined }} onClick={() => setTool("text")} className='shadow p-2'><svg width="30" height="30" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_41_41)">
                                    <path fill={tool == "text" ? "white" : "black"} d="M9.375 6.5625C8.62908 6.5625 7.91371 6.85882 7.38626 7.38626C6.85882 7.91371 6.5625 8.62908 6.5625 9.375C6.5625 10.1209 6.85882 10.8363 7.38626 11.3637C7.91371 11.8912 8.62908 12.1875 9.375 12.1875H19.6875V37.5C19.6875 38.2459 19.9838 38.9613 20.5113 39.4887C21.0387 40.0162 21.7541 40.3125 22.5 40.3125C23.2459 40.3125 23.9613 40.0162 24.4887 39.4887C25.0162 38.9613 25.3125 38.2459 25.3125 37.5V12.1875H35.625C36.3709 12.1875 37.0863 11.8912 37.6137 11.3637C38.1412 10.8363 38.4375 10.1209 38.4375 9.375C38.4375 8.62908 38.1412 7.91371 37.6137 7.38626C37.0863 6.85882 36.3709 6.5625 35.625 6.5625H9.375Z" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_41_41">
                                        <rect width="45" height="45" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            </button>
                            <label title='Insert image' htmlFor='selectImage' onClick={() => setTool("img")} style={{ borderRadius: "8px", background: tool === "img" ? "#5555ff" : undefined }} className='shadow p-2'><svg width="30" height="30" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.375 39.375C8.34375 39.375 7.46125 39.0081 6.7275 38.2744C5.99375 37.5406 5.62625 36.6575 5.625 35.625V9.375C5.625 8.34375 5.9925 7.46125 6.7275 6.7275C7.4625 5.99375 8.345 5.62625 9.375 5.625H35.625C36.6563 5.625 37.5394 5.9925 38.2744 6.7275C39.0094 7.4625 39.3762 8.345 39.375 9.375V35.625C39.375 36.6563 39.0081 37.5394 38.2744 38.2744C37.5406 39.0094 36.6575 39.3762 35.625 39.375H9.375ZM11.25 31.875H33.75L26.7188 22.5L21.0938 30L16.875 24.375L11.25 31.875Z" fill={tool === "img" ? "white" : "black"} />
                            </svg>


                            </label>
                            <input type="file" id="selectImage" className='hidden' accept='image/jpeg, image/png' onChange={handleFileUploads} />
                            <select title='Insert predefined embeddings' defaultValue={""} className='shadow p-2' onChange={(e) => {
                                const textBox = new Textbox(e.target.value, { fill: "#000000ff", top: 100, left: 100, fontSize: 20, fontWeight: 200, fontStyle: "normal", fontFamily: "Roboto" })
                                canvas.add(textBox)
                                canvas.renderAll()
                            }}>
                                <option disabled hidden>Embeddings</option>
                                {listEmbeddings.map((val, i) => <option key={i} value={val.value}>{val.title}</option>)}
                            </select>
                            <button title='Insert QR code' style={{ borderRadius: "8px", background: tool === "text" ? "#5555ff" : undefined }} onClick={() => {
                                const img = new Image()
                                // img.width=100
                                // img.height=100
                                img.src = "https://certificates.redrindia.org/qr.webp"
                                const imgObj = new FabricImage(img, {
                                    top: 100, left: 100, //scaleX: .3, scaleY: .3,
                                    // width:100,height:100,
                                    lockScalingX: true,
                                    lockScalingY: true,
                                    lockRotation: true,
                                    id: "qrcode",

                                })
                                imgObj.scaleToWidth(130)
                                imgObj.scaleToHeight(130)
                                // imgObj.lockRotation=true
                                // imgObj.toObject = function () {
                                //     return { 
                                //         id: 'qrcode'
                                //     };
                                // };
                                // imgObj.set("id", "qrcode")
                                canvas.add(imgObj)
                                canvas.renderAll()
                            }} className='shadow p-2 w-11'><img src={"https://certificates.redrindia.org/qr.webp"} className="" />
                            </button>
                            <button title='Create from existing' style={{ borderRadius: "8px", background: tool === "text" ? "#5555ff" : undefined }} onClick={() => {
                                templateRef.current?.click()
                            }} className='shadow p-2 w-11'>
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.25 2.5C5.25544 2.5 4.30161 2.89509 3.59835 3.59835C2.89509 4.30161 2.5 5.25544 2.5 6.25V16.25C2.5 17.2446 2.89509 18.1984 3.59835 18.9017C4.30161 19.6049 5.25544 20 6.25 20H8.79375C8.76425 19.793 8.74963 19.5841 8.75 19.375V13.125C8.75 11.9 9.2525 10.7937 10.0625 10H6.875C6.70924 10 6.55027 9.93415 6.43306 9.81694C6.31585 9.69973 6.25 9.54076 6.25 9.375C6.25 9.20924 6.31585 9.05027 6.43306 8.93306C6.55027 8.81585 6.70924 8.75 6.875 8.75H19.375C19.5875 8.75 19.7958 8.76458 20 8.79375V6.25C20 5.25544 19.6049 4.30161 18.9017 3.59835C18.1984 2.89509 17.2446 2.5 16.25 2.5H6.25ZM6.25 6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H15.625C15.7908 6.25 15.9497 6.31585 16.0669 6.43306C16.1842 6.55027 16.25 6.70924 16.25 6.875C16.25 7.04076 16.1842 7.19973 16.0669 7.31694C15.9497 7.43415 15.7908 7.5 15.625 7.5H6.875C6.70924 7.5 6.55027 7.43415 6.43306 7.31694C6.31585 7.19973 6.25 7.04076 6.25 6.875ZM10 13.125C10 12.2962 10.3292 11.5013 10.9153 10.9153C11.5013 10.3292 12.2962 10 13.125 10H19.375C20.2038 10 20.9987 10.3292 21.5847 10.9153C22.1708 11.5013 22.5 12.2962 22.5 13.125V13.75H10V13.125ZM10 19.375V15H22.5V19.375C22.5 20.2038 22.1708 20.9987 21.5847 21.5847C20.9987 22.1708 20.2038 22.5 19.375 22.5H13.125C12.2962 22.5 11.5013 22.1708 10.9153 21.5847C10.3292 20.9987 10 20.2038 10 19.375Z" fill="black" />
                                </svg>
                            </button>
                        </div>
                        <div className="tools shadow gap-2 p-3 w-min  my-2 mx-auto justify-center flex flex-col">
                            <div className='flex gap-2'>
                                <button title='Align left' className='hover:bg-radial-center-black' onClick={() => alignObject("left")}>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.125 5.20833C3.125 4.6558 3.34449 4.12589 3.73519 3.73519C4.12589 3.34449 4.6558 3.125 5.20833 3.125L19.7917 3.125C20.3442 3.125 20.8741 3.34449 21.2648 3.73519C21.6555 4.1259 21.875 4.6558 21.875 5.20833L21.875 9.375C21.875 9.92753 21.6555 10.4574 21.2648 10.8481C20.8741 11.2388 20.3442 11.4583 19.7917 11.4583L5.20833 11.4583C4.6558 11.4583 4.12589 11.2388 3.73519 10.8481C3.34449 10.4574 3.125 9.92753 3.125 9.375L3.125 5.20833ZM3.125 15.625C3.125 15.0725 3.34449 14.5426 3.73519 14.1519C4.12589 13.7612 4.6558 13.5417 5.20833 13.5417L15.625 13.5417C16.1775 13.5417 16.7074 13.7612 17.0981 14.1519C17.4888 14.5426 17.7083 15.0725 17.7083 15.625L17.7083 19.7917C17.7083 20.3442 17.4888 20.8741 17.0981 21.2648C16.7074 21.6555 16.1775 21.875 15.625 21.875L5.20833 21.875C4.6558 21.875 4.12589 21.6555 3.73519 21.2648C3.34449 20.8741 3.125 20.3442 3.125 19.7917L3.125 15.625Z" fill="black" />
                                    </svg>
                                </button>
                                <button title='Align horizontally' className='hover:bg-radial-center-black' onClick={() => alignObject("horizontally")}>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.375 20.3125C9.375 20.7269 9.53962 21.1243 9.83265 21.4174C10.1257 21.7104 10.5231 21.875 10.9375 21.875H14.0625C14.4769 21.875 14.8743 21.7104 15.1674 21.4174C15.4604 21.1243 15.625 20.7269 15.625 20.3125V4.6875C15.625 4.2731 15.4604 3.87567 15.1674 3.58265C14.8743 3.28962 14.4769 3.125 14.0625 3.125H10.9375C10.5231 3.125 10.1257 3.28962 9.83265 3.58265C9.53962 3.87567 9.375 4.2731 9.375 4.6875V20.3125ZM1.5625 12.5C1.5625 12.7072 1.64481 12.9059 1.79132 13.0524C1.93784 13.1989 2.13655 13.2812 2.34375 13.2812H9.375V11.7188H2.34375C2.13655 11.7188 1.93784 11.8011 1.79132 11.9476C1.64481 12.0941 1.5625 12.2928 1.5625 12.5ZM23.4375 12.5C23.4375 12.7072 23.3552 12.9059 23.2087 13.0524C23.0622 13.1989 22.8635 13.2812 22.6562 13.2812H15.625V11.7188H22.6562C22.8635 11.7188 23.0622 11.8011 23.2087 11.9476C23.3552 12.0941 23.4375 12.2928 23.4375 12.5Z" fill="black" />
                                    </svg>
                                </button>
                                <button title='Align right' className='hover:bg-radial-center-black' onClick={() => alignObject("right")}>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M21.875 5.20833C21.875 4.6558 21.6555 4.12589 21.2648 3.73519C20.8741 3.34449 20.3442 3.125 19.7917 3.125L5.20833 3.125C4.6558 3.125 4.1259 3.34449 3.7352 3.73519C3.34449 4.1259 3.125 4.6558 3.125 5.20833L3.125 9.375C3.125 9.92753 3.34449 10.4574 3.7352 10.8481C4.1259 11.2388 4.6558 11.4583 5.20833 11.4583L19.7917 11.4583C20.3442 11.4583 20.8741 11.2388 21.2648 10.8481C21.6555 10.4574 21.875 9.92753 21.875 9.375L21.875 5.20833ZM21.875 15.625C21.875 15.0725 21.6555 14.5426 21.2648 14.1519C20.8741 13.7612 20.3442 13.5417 19.7917 13.5417L9.375 13.5417C8.82247 13.5417 8.29256 13.7612 7.90186 14.1519C7.51116 14.5426 7.29167 15.0725 7.29167 15.625L7.29167 19.7917C7.29167 20.3442 7.51116 20.8741 7.90186 21.2648C8.29256 21.6555 8.82247 21.875 9.375 21.875L19.7917 21.875C20.3442 21.875 20.8741 21.6555 21.2648 21.2648C21.6555 20.8741 21.875 20.3442 21.875 19.7917L21.875 15.625Z" fill="black" />
                                    </svg>
                                </button>
                            </div>
                            <div className='flex gap-2'>
                                <button title='Align top' className='hover:bg-radial-center-black' onClick={() => alignObject("top")}>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.20833 3.125C4.6558 3.125 4.12589 3.34449 3.73519 3.73519C3.34449 4.12589 3.125 4.6558 3.125 5.20833V19.7917C3.125 20.3442 3.34449 20.8741 3.73519 21.2648C4.12589 21.6555 4.6558 21.875 5.20833 21.875H9.375C9.92753 21.875 10.4574 21.6555 10.8481 21.2648C11.2388 20.8741 11.4583 20.3442 11.4583 19.7917V5.20833C11.4583 4.6558 11.2388 4.12589 10.8481 3.73519C10.4574 3.34449 9.92753 3.125 9.375 3.125H5.20833ZM15.625 3.125C15.0725 3.125 14.5426 3.34449 14.1519 3.73519C13.7612 4.12589 13.5417 4.6558 13.5417 5.20833V15.625C13.5417 16.1775 13.7612 16.7074 14.1519 17.0981C14.5426 17.4888 15.0725 17.7083 15.625 17.7083H19.7917C20.3442 17.7083 20.8741 17.4888 21.2648 17.0981C21.6555 16.7074 21.875 16.1775 21.875 15.625V5.20833C21.875 4.6558 21.6555 4.12589 21.2648 3.73519C20.8741 3.34449 20.3442 3.125 19.7917 3.125H15.625Z" fill="black" />
                                    </svg>
                                </button>
                                <button title='Align vertically' className='hover:bg-radial-center-black' onClick={() => alignObject("vertically")}>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.3125 15.625C20.7269 15.625 21.1243 15.4604 21.4174 15.1674C21.7104 14.8743 21.875 14.4769 21.875 14.0625L21.875 10.9375C21.875 10.5231 21.7104 10.1257 21.4174 9.83265C21.1243 9.53962 20.7269 9.375 20.3125 9.375L4.6875 9.375C4.2731 9.375 3.87567 9.53962 3.58264 9.83265C3.28962 10.1257 3.125 10.5231 3.125 10.9375L3.125 14.0625C3.125 14.4769 3.28962 14.8743 3.58265 15.1674C3.87567 15.4604 4.2731 15.625 4.6875 15.625L20.3125 15.625ZM12.5 23.4375C12.7072 23.4375 12.9059 23.3552 13.0524 23.2087C13.1989 23.0622 13.2812 22.8634 13.2812 22.6562L13.2812 15.625L11.7187 15.625L11.7187 22.6562C11.7187 22.8635 11.8011 23.0622 11.9476 23.2087C12.0941 23.3552 12.2928 23.4375 12.5 23.4375ZM12.5 1.5625C12.7072 1.5625 12.9059 1.64481 13.0524 1.79132C13.1989 1.93783 13.2812 2.13655 13.2812 2.34375L13.2812 9.375L11.7187 9.375L11.7187 2.34375C11.7187 2.13655 11.8011 1.93783 11.9476 1.79132C12.0941 1.64481 12.2928 1.5625 12.5 1.5625Z" fill="black" />
                                    </svg>
                                </button>
                                <button title='Align bottom' className='hover:bg-radial-center-black' onClick={() => alignObject("bottom")}>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.20833 21.875C4.6558 21.875 4.12589 21.6555 3.73519 21.2648C3.34449 20.8741 3.125 20.3442 3.125 19.7917V5.20833C3.125 4.6558 3.34449 4.1259 3.73519 3.7352C4.12589 3.34449 4.6558 3.125 5.20833 3.125H9.375C9.92753 3.125 10.4574 3.34449 10.8481 3.7352C11.2388 4.1259 11.4583 4.6558 11.4583 5.20833V19.7917C11.4583 20.3442 11.2388 20.8741 10.8481 21.2648C10.4574 21.6555 9.92753 21.875 9.375 21.875H5.20833ZM15.625 21.875C15.0725 21.875 14.5426 21.6555 14.1519 21.2648C13.7612 20.8741 13.5417 20.3442 13.5417 19.7917V9.375C13.5417 8.82247 13.7612 8.29256 14.1519 7.90186C14.5426 7.51116 15.0725 7.29167 15.625 7.29167H19.7917C20.3442 7.29167 20.8741 7.51116 21.2648 7.90186C21.6555 8.29256 21.875 8.82247 21.875 9.375V19.7917C21.875 20.3442 21.6555 20.8741 21.2648 21.2648C20.8741 21.6555 20.3442 21.875 19.7917 21.875H15.625Z" fill="black" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <CanvasPaint ref={canvasEl} />
                </div>
                {/* <div className="tools shadow gap-2 p-4 w-min rounded  my-2 justify-center flex flex-row"> */}
                {/* <div style={{  background: "url(data:image/svg+xml;utf8,%3Csvg%20width%3D%222%22%20height%3D%222%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200h1v2h1V1H0%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23e1e1e1%22/%3E%3C/svg%3E)" }}>
                        <div></div>
                    </div> */}
                {
                    // Array.from(getPropertyList()).map(property=><h1 key={property}>{property}</h1>)
                    // <Properties canvas={canvas} />
                }
                {/* </div> */}
            </div>

        </div>
    );
};
interface ShowCanvasProps { initialData: string, showDownload: Boolean, makeitimg: Boolean, location: string, downloadName: string }
export const ShowCanvas: FunctionComponent<ShowCanvasProps> = ({ initialData, showDownload, makeitimg = false, location = window.location.href, downloadName = window.location.pathname }) => {
    const [canvas, setCanvas] = useState<Canvas>(() => new Canvas());
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const qrcodeRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const json = JSON.parse(initialData || "{ }");

    const retrive = async (_: string) => {
        // console.log(data);
        // if (!canvas) return;

        await canvas.loadFromJSON(json, function (_, object) {

            if (!qrcodeRef.current) return;
            const object1 = object as FabricImage & { id?: "" }
            if (!object1.id) return;
            if ((object1.id as string) !== "qrcode") return;

            const imgDataURL = qrcodeRef.current.toDataURL("image/png");
            const qrImage = new Image();
            qrImage.src = imgDataURL;
            qrImage.onload = () => {
                object1.setElement(qrImage)
                object1.scaleToWidth(130)
                object1.scaleToHeight(130)
                canvas.renderAll();
            };
        });
        canvas.renderAll()
        canvas.setDimensions({ width: json.canvasWidth, height: json.canvasHeight })
        canvas.upperCanvasEl.style.pointerEvents = "none"


    }

    const finalImg = () => {
        // if (!canvas) return;

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1.0, // 0.0 to 1.0
            // TODO: confirm the below value
            multiplier: 1
        });

        // Create an image element
        const imgElement = document.createElement('img');
        imgElement.src = dataURL;
        if (!containerRef.current) return;
        containerRef.current.innerHTML = ""
        containerRef.current.appendChild(imgElement);

        (window as customWindow).downloadLink = dataURL

    }
    type customWindow = (Window & { downloadLink?: string })
    const handleDownload = () => {
        const ele = document.createElement("a")
        ele.href = (window as customWindow).downloadLink || ""
        ele.download = downloadName
        ele.click()
    }

    useEffect(() => {
        if (!canvasEl.current) return;
        const canvas = new Canvas(canvasEl.current, {
            width: json?.canvasWidth || 1056,
            height: json?.canvasHeight || 816,
            backgroundColor: 'white',
            preserveObjectStacking: true,
            selection: false,

        });
        setCanvas(canvas)

        return () => {
            canvas.dispose()
        }
    }, [])

    useEffect(() => {
        // if (!canvas) return;
        retrive(initialData).then(() => {
            if (makeitimg)
                setTimeout(finalImg, 0)
        })

    }, [canvas, initialData])
    return <div className='flex flex-col items-center'> <div ref={containerRef} className={"border-black"}><CanvasPaint ref={canvasEl} />
        <div style={{ display: "none" }}>
            <QRCodeCanvas
                value={location}
                size={100}
                imageSettings={{
                    src: "/cropped-fevIocn-192x192.png",
                    // x: null, // Positioning of the logo (null for center)
                    // y: null,
                    height: 20, // Height of the logo
                    width: 20, // Width of the logo
                    excavate: true,
                }}
                level={"H"}
                ref={qrcodeRef}
            />
        </div>
    </div>
        {showDownload && <button onClick={handleDownload} className="btn btn-primary w-min ">Download</button>}
    </div>
}
const CanvasPaint = forwardRef<HTMLCanvasElement>((_, ref) => {
    return <canvas ref={ref} style={{ border: '1px solid black' }} />

})
export default CanvasComponent;
