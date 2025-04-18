import { Canvas, Ellipse, Rect, Textbox, } from "fabric";
import { action, computed, makeObservable, observable } from "mobx";
import { FabricObjectAdapter } from "./FabricObjectAdapter";


type toolListType = "select" | "rect" | "elipse" | "text"

export class ReactFabricStore {

    public _;
    /**
     * @availableTools
     * This is a list that contains object consist of below property
     * @property 
     * name - name of the tool
     * currentValue - Current value of the tool (calculated based on selected elements)
     * setValue - function to set the value of the tool
     * UIComponent - Default Render UI
     * 
     */
    altKeyFired = false;
    cloneObjRef: { current: any } = { current: "" };
    isDrawing = false
    drawColor = ""
    @observable public accessor selectedTool: toolListType
    @computed public get availableTools() {
        return [
            {
                name: "Select", UIComponent: <button title='select' style={{ borderRadius: "8px", background: this.selectedTool === "select" ? "#5555ff" : undefined }} onClick={() => this.selectTool("select")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.27254 0.463265C4.08937 0.451781 3.90591 0.480776 3.73521 0.548189C3.5645 0.615602 3.41073 0.719779 3.28483 0.853319C3.15893 0.98686 3.06397 1.14649 3.00672 1.32086C2.94946 1.49524 2.93131 1.68008 2.95354 1.86226L4.84279 22.134C4.96354 23.1185 6.12704 23.5773 6.88679 22.9398L10.8735 19.7068L12.661 22.803C13.689 24.5835 15.32 25.021 17.1005 23.993C18.881 22.965 19.318 21.3335 18.29 19.553L16.5088 16.468L21.2328 14.657C22.1648 14.3178 22.3495 13.0805 21.5578 12.4838L4.94604 0.711765C4.7506 0.564815 4.5166 0.478416 4.27254 0.463265Z" fill={this.selectedTool === "select" ? "white" : "black"} />
                </svg>
                </button>
            },
            {
                name: "Rectangle", UIComponent: <button title='Rectangle' style={{ borderRadius: "8px", background: this.selectedTool === "rect" ? "#5555ff" : undefined }} onClick={() => this.selectTool("rect")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.7917 4.16666H5.20837C4.37957 4.16666 3.58472 4.4959 2.99867 5.08195C2.41261 5.668 2.08337 6.46286 2.08337 7.29166V17.7083C2.08337 18.5371 2.41261 19.332 2.99867 19.918C3.58472 20.5041 4.37957 20.8333 5.20837 20.8333H19.7917C20.6205 20.8333 21.4154 20.5041 22.0014 19.918C22.5875 19.332 22.9167 18.5371 22.9167 17.7083V7.29166C22.9167 6.46286 22.5875 5.668 22.0014 5.08195C21.4154 4.4959 20.6205 4.16666 19.7917 4.16666Z" fill={this.selectedTool === "rect" ? "white" : "black"} />
                </svg>
                </button>
            },
            {
                name: "Elipse", UIComponent: <button title='Elipse' style={{ borderRadius: "8px", background: this.selectedTool === "elipse" ? "#5555ff" : undefined }} onClick={() => this.selectTool("elipse")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 22.9167C11.0591 22.9167 9.7049 22.6431 8.43754 22.0958C7.17018 21.5486 6.06775 20.8066 5.13025 19.8698C4.19275 18.933 3.45074 17.8306 2.90421 16.5625C2.35768 15.2945 2.08407 13.9403 2.08338 12.5C2.08268 11.0597 2.35629 9.70557 2.90421 8.43751C3.45213 7.16945 4.19414 6.06702 5.13025 5.13022C6.06636 4.19341 7.16879 3.4514 8.43754 2.90418C9.70629 2.35695 11.0605 2.08334 12.5 2.08334C13.9396 2.08334 15.2938 2.35695 16.5625 2.90418C17.8313 3.4514 18.9337 4.19341 19.8698 5.13022C20.8059 6.06702 21.5483 7.16945 22.0969 8.43751C22.6455 9.70557 22.9188 11.0597 22.9167 12.5C22.9146 13.9403 22.641 15.2945 22.0959 16.5625C21.5507 17.8306 20.8087 18.933 19.8698 19.8698C18.9309 20.8066 17.8285 21.549 16.5625 22.0969C15.2966 22.6448 13.9424 22.9181 12.5 22.9167Z" fill={this.selectedTool === "elipse" ? "white" : "black"} />
                </svg>
                </button>
            },
            {
                name: "Text", UIComponent: <button title='Text' style={{ borderRadius: "8px", background: this.selectedTool === "text" ? "#5555ff" : undefined }} onClick={() => this.selectTool("text")} className='shadow p-2'><svg width="30" height="30" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_41_41)">
                        <path fill={this.selectedTool == "text" ? "white" : "black"} d="M9.375 6.5625C8.62908 6.5625 7.91371 6.85882 7.38626 7.38626C6.85882 7.91371 6.5625 8.62908 6.5625 9.375C6.5625 10.1209 6.85882 10.8363 7.38626 11.3637C7.91371 11.8912 8.62908 12.1875 9.375 12.1875H19.6875V37.5C19.6875 38.2459 19.9838 38.9613 20.5113 39.4887C21.0387 40.0162 21.7541 40.3125 22.5 40.3125C23.2459 40.3125 23.9613 40.0162 24.4887 39.4887C25.0162 38.9613 25.3125 38.2459 25.3125 37.5V12.1875H35.625C36.3709 12.1875 37.0863 11.8912 37.6137 11.3637C38.1412 10.8363 38.4375 10.1209 38.4375 9.375C38.4375 8.62908 38.1412 7.91371 37.6137 7.38626C37.0863 6.85882 36.3709 6.5625 35.625 6.5625H9.375Z" />
                    </g>
                    <defs>
                        <clipPath id="clip0_41_41">
                            <rect width="45" height="45" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                </button>
            },
        ]
    }

    @observable public accessor availableProperties: {} = {}
    canvasWidth: number;
    canvasHeight: number;
    backgroundColor: string;

    constructor({ canvasWidth, canvasHeight, backgroundColor, fabricCanvasInstance }: { fabricCanvasInstance: Canvas, canvasWidth: number, canvasHeight: number, backgroundColor: string }) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.backgroundColor = backgroundColor

        // initialize the fabric Canvas layout
        // const { fabricCanvasInstance, UIComponent } = CanvasRenderer({ backgroundColor, canvasHeight, canvasWidth })
        // this.UIComponent = UIComponent

        // initialize the base state
        this.selectedTool = "select"


        // base canvas instance
        this._ = fabricCanvasInstance

        this.availableProperties = {}



        // listening events
        this._.on("selection:cleared", this.updateSelectedObjPropertyList)
        this._.on("selection:created", this.updateSelectedObjPropertyList)
        this._.on("selection:updated", this.updateSelectedObjPropertyList)
        this._.on("object:modified", this.updateSelectedObjPropertyList)




        let obj, origX: number, origY: number;


        // Handle mouse click to create rectangle
        this._.on('mouse:down', (options) => {
            if (this.selectedTool === "select") {
                this.cloneObjRef.current = this._.getActiveObjects()
                return
            };

            this.isDrawing = true
            if (options.e) {
                const pointer = this._.getPointer(options.e);
                origX = pointer.x
                origY = pointer.y
                if (this.selectedTool == "rect")
                    obj = new Rect({
                        left: origX,
                        top: origY,
                        fill: this.drawColor, // Default fill color
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
                else if (this.selectedTool == "elipse")
                    obj = new Ellipse({
                        left: origX,
                        top: origY,
                        fill: this.drawColor, // Default fill color
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
                        fill: this.drawColor, // Default fill color
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
                this._.add(obj);
                this._.setActiveObject(obj);

            }
            this._.renderAll()


        });


        this._.on('mouse:move', (options) => {

            // console.log(options.e.altKey, options.e.repeat)

            if (!this.isDrawing) return;
            // console.log(options);
            const pointer = this._.getPointer(options.e);
            let x = pointer.x, y = pointer.y;

            if (x > canvasWidth || y > canvasHeight || x < 0 || y < 0) return

            const activeObject = this._.getActiveObject();
            if (activeObject) {
                if (this.selectedTool == "rect")
                    activeObject.set({
                        width: Math.abs(pointer.x - origX),
                        height: Math.abs(pointer.y - origY),
                        left: Math.min(origX, pointer.x),
                        top: Math.min(origY, pointer.y)
                    });
                else if (this.selectedTool == "elipse")
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
                this._.renderAll();
            }
        });

        this._.on('mouse:up', (_) => {
            this.isDrawing = false
            if (this.selectedTool == "text") {
                const activeObject = this._.getActiveObject();
                if (activeObject)
                    (activeObject as Textbox).enterEditing()
            }


            this.selectTool("select")

            this._.renderAll()

        });


        this._?.on("object:rotating", (e) => {
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
                this._.renderAll();
            }
        })



        makeObservable(this)
    }

    /**
     * This function is used to select the tool
     * @param tool - @type toolListType tool name 
     * 
     */
    @action
    selectTool(tool: toolListType) {
        this.selectedTool = tool
    }
    /**
     * this function updates selected object's property list with it's value in availableProperties
     * 
     */
    @action
    updateSelectedObjPropertyList() {

        let propertyValueList = {}

        if (!this._) {
            this.availableProperties = propertyValueList
            return
        }

        const objs = this._.getActiveObjects()


        objs.forEach(obj => {
            const customObj = FabricObjectAdapter.createAdapter(obj.type, obj)
            propertyValueList = { ...propertyValueList, ...customObj.getObjectValues() }
        })

        this.availableProperties = propertyValueList
    }
}

