import { ActiveSelection, Canvas, Ellipse, Rect, Textbox, } from "fabric";
import { action, computed, makeObservable, observable } from "mobx";
import { FabricObjectAdapter } from "./FabricObjectAdapter";
import { FontInfo } from "./types/types";
import { FabricObjectPropertyList, FabricObjectPropertyType, FabricObjectPropertyValueType } from "./types/WrapperFabricType";
import InputColor from "./UserFirendlyInput/Color";
import InputNumber from "./UserFirendlyInput/Number";
import InputRange from "./UserFirendlyInput/Range";
import InputSelect from "./UserFirendlyInput/Select";


type toolListType = "select" | "rect" | "elipse" | "text"
type objMoveType = 1 | 2 | -1 | -2
type objPositionType = "left" | "right" | "top" | "bottom" | "horizontally" | "vertically"
type availablePropertyType = {
    name: string, inputType: FabricObjectPropertyType extends { type: infer V } ? V : never, property: FabricObjectPropertyType, value: FabricObjectPropertyValueType, onChange: (value: any) => void,
    UIComponent: React.ReactNode
}
export class ReactFabricStore {


    private fonts: FontInfo[]
    private cloneObjRef: { current: any } = { current: "" };
    private isDrawing = false
    private drawColor = "black"

    /** @type Canvas
     *  Provides the FabricCanvas instance for better control */
    public _: Canvas;

    /**
     * List of property values for the currently selected object(s)
     */
    @observable public accessor propertyValueList: FabricObjectPropertyList = {}
    /**
     * Currently selected drawing tool
     */
    @observable public accessor selectedTool: toolListType

    /**
     * List of available tools and properties that can be accessed
     * Contains object arrays with:
     * - name: Name of the tool
     * - action: Function to invoke 
     * - UIComponent: Default UI component
     */
    @computed public get availableTools() {
        return {
            alignmentTools: [
                {
                    name: "Align left", action: () => this.alignObject("left"), UIComponent: <button title='Align left' className='hover:bg-radial-center-black' onClick={() => this.alignObject("left")}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3.125 5.20833C3.125 4.6558 3.34449 4.12589 3.73519 3.73519C4.12589 3.34449 4.6558 3.125 5.20833 3.125L19.7917 3.125C20.3442 3.125 20.8741 3.34449 21.2648 3.73519C21.6555 4.1259 21.875 4.6558 21.875 5.20833L21.875 9.375C21.875 9.92753 21.6555 10.4574 21.2648 10.8481C20.8741 11.2388 20.3442 11.4583 19.7917 11.4583L5.20833 11.4583C4.6558 11.4583 4.12589 11.2388 3.73519 10.8481C3.34449 10.4574 3.125 9.92753 3.125 9.375L3.125 5.20833ZM3.125 15.625C3.125 15.0725 3.34449 14.5426 3.73519 14.1519C4.12589 13.7612 4.6558 13.5417 5.20833 13.5417L15.625 13.5417C16.1775 13.5417 16.7074 13.7612 17.0981 14.1519C17.4888 14.5426 17.7083 15.0725 17.7083 15.625L17.7083 19.7917C17.7083 20.3442 17.4888 20.8741 17.0981 21.2648C16.7074 21.6555 16.1775 21.875 15.625 21.875L5.20833 21.875C4.6558 21.875 4.12589 21.6555 3.73519 21.2648C3.34449 20.8741 3.125 20.3442 3.125 19.7917L3.125 15.625Z" fill="black" />
                        </svg>
                    </button>
                },
                {
                    name: "Align horizontally", action: () => this.alignObject("horizontally"), UIComponent: <button title='Align horizontally' className='hover:bg-radial-center-black' onClick={() => this.alignObject("horizontally")}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.375 20.3125C9.375 20.7269 9.53962 21.1243 9.83265 21.4174C10.1257 21.7104 10.5231 21.875 10.9375 21.875H14.0625C14.4769 21.875 14.8743 21.7104 15.1674 21.4174C15.4604 21.1243 15.625 20.7269 15.625 20.3125V4.6875C15.625 4.2731 15.4604 3.87567 15.1674 3.58265C14.8743 3.28962 14.4769 3.125 14.0625 3.125H10.9375C10.5231 3.125 10.1257 3.28962 9.83265 3.58265C9.53962 3.87567 9.375 4.2731 9.375 4.6875V20.3125ZM1.5625 12.5C1.5625 12.7072 1.64481 12.9059 1.79132 13.0524C1.93784 13.1989 2.13655 13.2812 2.34375 13.2812H9.375V11.7188H2.34375C2.13655 11.7188 1.93784 11.8011 1.79132 11.9476C1.64481 12.0941 1.5625 12.2928 1.5625 12.5ZM23.4375 12.5C23.4375 12.7072 23.3552 12.9059 23.2087 13.0524C23.0622 13.1989 22.8635 13.2812 22.6562 13.2812H15.625V11.7188H22.6562C22.8635 11.7188 23.0622 11.8011 23.2087 11.9476C23.3552 12.0941 23.4375 12.2928 23.4375 12.5Z" fill="black" />
                        </svg>
                    </button>
                },
                {
                    name: "Align right", action: () => this.alignObject("right"), UIComponent: <button title='Align right' className='hover:bg-radial-center-black' onClick={() => this.alignObject("right")}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.875 5.20833C21.875 4.6558 21.6555 4.12589 21.2648 3.73519C20.8741 3.34449 20.3442 3.125 19.7917 3.125L5.20833 3.125C4.6558 3.125 4.1259 3.34449 3.7352 3.73519C3.34449 4.1259 3.125 4.6558 3.125 5.20833L3.125 9.375C3.125 9.92753 3.34449 10.4574 3.7352 10.8481C4.1259 11.2388 4.6558 11.4583 5.20833 11.4583L19.7917 11.4583C20.3442 11.4583 20.8741 11.2388 21.2648 10.8481C21.6555 10.4574 21.875 9.92753 21.875 9.375L21.875 5.20833ZM21.875 15.625C21.875 15.0725 21.6555 14.5426 21.2648 14.1519C20.8741 13.7612 20.3442 13.5417 19.7917 13.5417L9.375 13.5417C8.82247 13.5417 8.29256 13.7612 7.90186 14.1519C7.51116 14.5426 7.29167 15.0725 7.29167 15.625L7.29167 19.7917C7.29167 20.3442 7.51116 20.8741 7.90186 21.2648C8.29256 21.6555 8.82247 21.875 9.375 21.875L19.7917 21.875C20.3442 21.875 20.8741 21.6555 21.2648 21.2648C21.6555 20.8741 21.875 20.3442 21.875 19.7917L21.875 15.625Z" fill="black" />
                        </svg>
                    </button>
                },

                {
                    name: "Align top", action: () => this.alignObject("top"), UIComponent: <button title='Align top' className='hover:bg-radial-center-black' onClick={() => this.alignObject("top")}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.20833 3.125C4.6558 3.125 4.12589 3.34449 3.73519 3.73519C3.34449 4.12589 3.125 4.6558 3.125 5.20833V19.7917C3.125 20.3442 3.34449 20.8741 3.73519 21.2648C4.12589 21.6555 4.6558 21.875 5.20833 21.875H9.375C9.92753 21.875 10.4574 21.6555 10.8481 21.2648C11.2388 20.8741 11.4583 20.3442 11.4583 19.7917V5.20833C11.4583 4.6558 11.2388 4.12589 10.8481 3.73519C10.4574 3.34449 9.92753 3.125 9.375 3.125H5.20833ZM15.625 3.125C15.0725 3.125 14.5426 3.34449 14.1519 3.73519C13.7612 4.12589 13.5417 4.6558 13.5417 5.20833V15.625C13.5417 16.1775 13.7612 16.7074 14.1519 17.0981C14.5426 17.4888 15.0725 17.7083 15.625 17.7083H19.7917C20.3442 17.7083 20.8741 17.4888 21.2648 17.0981C21.6555 16.7074 21.875 16.1775 21.875 15.625V5.20833C21.875 4.6558 21.6555 4.12589 21.2648 3.73519C20.8741 3.34449 20.3442 3.125 19.7917 3.125H15.625Z" fill="black" />
                        </svg>
                    </button>
                },
                {
                    name: "Align vertically", action: () => this.alignObject("vertically"), UIComponent: <button title='Align vertically' className='hover:bg-radial-center-black' onClick={() => this.alignObject("vertically")}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.3125 15.625C20.7269 15.625 21.1243 15.4604 21.4174 15.1674C21.7104 14.8743 21.875 14.4769 21.875 14.0625L21.875 10.9375C21.875 10.5231 21.7104 10.1257 21.4174 9.83265C21.1243 9.53962 20.7269 9.375 20.3125 9.375L4.6875 9.375C4.2731 9.375 3.87567 9.53962 3.58264 9.83265C3.28962 10.1257 3.125 10.5231 3.125 10.9375L3.125 14.0625C3.125 14.4769 3.28962 14.8743 3.58265 15.1674C3.87567 15.4604 4.2731 15.625 4.6875 15.625L20.3125 15.625ZM12.5 23.4375C12.7072 23.4375 12.9059 23.3552 13.0524 23.2087C13.1989 23.0622 13.2812 22.8634 13.2812 22.6562L13.2812 15.625L11.7187 15.625L11.7187 22.6562C11.7187 22.8635 11.8011 23.0622 11.9476 23.2087C12.0941 23.3552 12.2928 23.4375 12.5 23.4375ZM12.5 1.5625C12.7072 1.5625 12.9059 1.64481 13.0524 1.79132C13.1989 1.93783 13.2812 2.13655 13.2812 2.34375L13.2812 9.375L11.7187 9.375L11.7187 2.34375C11.7187 2.13655 11.8011 1.93783 11.9476 1.79132C12.0941 1.64481 12.2928 1.5625 12.5 1.5625Z" fill="black" />
                        </svg>
                    </button>
                },
                {
                    name: "Align bottom", action: () => this.alignObject("bottom"), UIComponent: <button title='Align bottom' className='hover:bg-radial-center-black' onClick={() => this.alignObject("bottom")}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.20833 21.875C4.6558 21.875 4.12589 21.6555 3.73519 21.2648C3.34449 20.8741 3.125 20.3442 3.125 19.7917V5.20833C3.125 4.6558 3.34449 4.1259 3.73519 3.7352C4.12589 3.34449 4.6558 3.125 5.20833 3.125H9.375C9.92753 3.125 10.4574 3.34449 10.8481 3.7352C11.2388 4.1259 11.4583 4.6558 11.4583 5.20833V19.7917C11.4583 20.3442 11.2388 20.8741 10.8481 21.2648C10.4574 21.6555 9.92753 21.875 9.375 21.875H5.20833ZM15.625 21.875C15.0725 21.875 14.5426 21.6555 14.1519 21.2648C13.7612 20.8741 13.5417 20.3442 13.5417 19.7917V9.375C13.5417 8.82247 13.7612 8.29256 14.1519 7.90186C14.5426 7.51116 15.0725 7.29167 15.625 7.29167H19.7917C20.3442 7.29167 20.8741 7.51116 21.2648 7.90186C21.6555 8.29256 21.875 8.82247 21.875 9.375V19.7917C21.875 20.3442 21.6555 20.8741 21.2648 21.2648C20.8741 21.6555 20.3442 21.875 19.7917 21.875H15.625Z" fill="black" />
                        </svg>
                    </button>
                },
            ],
            positionTools: [
                {
                    action: () => this.moveObject(2), name: "Bring to front", UIComponent: <button title='Bring to front' onClick={() => this.moveObject(2)}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.20825 3.125H19.7916M18.7499 13.5417L12.4999 7.29167M12.4999 7.29167L6.24992 13.5417M12.4999 7.29167V21.875" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                },
                {
                    action: () => this.moveObject(1), name: "Bring Forward", UIComponent: <button title='Bring Forward' onClick={() => this.moveObject(1)}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 21.875V3.64581" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.7916 10.4167L12.4999 3.125L5.20825 10.4167" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                },
                {
                    action: () => this.moveObject(-1), name: "Send backward", UIComponent: <button title='Send backward' onClick={() => this.moveObject(-1)}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5 3.12502V21.3542" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.7916 14.5833L12.4999 21.875L5.20825 14.5833" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                },
                {
                    action: () => this.moveObject(-2), name: "Send to back", UIComponent: <button title='Send to back' onClick={() => this.moveObject(-2)}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.20825 21.875H19.7916M18.7499 11.4583L12.4999 17.7083M12.4999 17.7083L6.24992 11.4583M12.4999 17.7083V3.125" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                },
                {
                    action: () => this.deleteActiveElement(), name: "Delete", UIComponent: <button title='Delete selected object' onClick={() => this.deleteActiveElement()}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.7923 4.16667H16.1465L15.1048 3.125H9.89648L8.85482 4.16667H5.20898V6.25H19.7923M6.25065 19.7917C6.25065 20.3442 6.47014 20.8741 6.86085 21.2648C7.25155 21.6555 7.78145 21.875 8.33398 21.875H16.6673C17.2199 21.875 17.7498 21.6555 18.1405 21.2648C18.5312 20.8741 18.7507 20.3442 18.7507 19.7917V7.29167H6.25065V19.7917Z" fill="black" />
                        </svg>
                    </button>
                },
            ],
            creationTools: [
                {
                    action: () => this.selectTool("select"), name: "Select", UIComponent: <button title='select' style={{ borderRadius: "8px", background: this.selectedTool === "select" ? "#5555ff" : undefined }} onClick={() => this.selectTool("select")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.27254 0.463265C4.08937 0.451781 3.90591 0.480776 3.73521 0.548189C3.5645 0.615602 3.41073 0.719779 3.28483 0.853319C3.15893 0.98686 3.06397 1.14649 3.00672 1.32086C2.94946 1.49524 2.93131 1.68008 2.95354 1.86226L4.84279 22.134C4.96354 23.1185 6.12704 23.5773 6.88679 22.9398L10.8735 19.7068L12.661 22.803C13.689 24.5835 15.32 25.021 17.1005 23.993C18.881 22.965 19.318 21.3335 18.29 19.553L16.5088 16.468L21.2328 14.657C22.1648 14.3178 22.3495 13.0805 21.5578 12.4838L4.94604 0.711765C4.7506 0.564815 4.5166 0.478416 4.27254 0.463265Z" fill={this.selectedTool === "select" ? "white" : "black"} />
                    </svg>
                    </button>
                },
                {
                    action: () => this.selectTool("rect"), name: "Rectangle", UIComponent: <button title='Rectangle' style={{ borderRadius: "8px", background: this.selectedTool === "rect" ? "#5555ff" : undefined }} onClick={() => this.selectTool("rect")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.7917 4.16666H5.20837C4.37957 4.16666 3.58472 4.4959 2.99867 5.08195C2.41261 5.668 2.08337 6.46286 2.08337 7.29166V17.7083C2.08337 18.5371 2.41261 19.332 2.99867 19.918C3.58472 20.5041 4.37957 20.8333 5.20837 20.8333H19.7917C20.6205 20.8333 21.4154 20.5041 22.0014 19.918C22.5875 19.332 22.9167 18.5371 22.9167 17.7083V7.29166C22.9167 6.46286 22.5875 5.668 22.0014 5.08195C21.4154 4.4959 20.6205 4.16666 19.7917 4.16666Z" fill={this.selectedTool === "rect" ? "white" : "black"} />
                    </svg>
                    </button>
                },
                {
                    action: () => this.selectTool("elipse"), name: "Elipse", UIComponent: <button title='Elipse' style={{ borderRadius: "8px", background: this.selectedTool === "elipse" ? "#5555ff" : undefined }} onClick={() => this.selectTool("elipse")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 22.9167C11.0591 22.9167 9.7049 22.6431 8.43754 22.0958C7.17018 21.5486 6.06775 20.8066 5.13025 19.8698C4.19275 18.933 3.45074 17.8306 2.90421 16.5625C2.35768 15.2945 2.08407 13.9403 2.08338 12.5C2.08268 11.0597 2.35629 9.70557 2.90421 8.43751C3.45213 7.16945 4.19414 6.06702 5.13025 5.13022C6.06636 4.19341 7.16879 3.4514 8.43754 2.90418C9.70629 2.35695 11.0605 2.08334 12.5 2.08334C13.9396 2.08334 15.2938 2.35695 16.5625 2.90418C17.8313 3.4514 18.9337 4.19341 19.8698 5.13022C20.8059 6.06702 21.5483 7.16945 22.0969 8.43751C22.6455 9.70557 22.9188 11.0597 22.9167 12.5C22.9146 13.9403 22.641 15.2945 22.0959 16.5625C21.5507 17.8306 20.8087 18.933 19.8698 19.8698C18.9309 20.8066 17.8285 21.549 16.5625 22.0969C15.2966 22.6448 13.9424 22.9181 12.5 22.9167Z" fill={this.selectedTool === "elipse" ? "white" : "black"} />
                    </svg>
                    </button>
                },
                {
                    action: () => this.selectTool("text"), name: "Text", UIComponent: <button title='Text' style={{ borderRadius: "8px", background: this.selectedTool === "text" ? "#5555ff" : undefined }} onClick={() => this.selectTool("text")} className='shadow p-2'><svg width="30" height="30" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    }
    /**
         * List of available properties that can be modified for selected objects
         * Contains objects with:
         * - name: Property name
         * - inputType: Type of input control
         * - property: Property configuration
         * - value: Current value
         * - onChange: Handler for value changes
         * - UIComponent: Default UI component
         */
    @computed public get availableProperties() {
        const availablePropertyList = [];

        // set canvas Width
        availablePropertyList.push({
            inputType: "number", name: "canvasWidth",
            // TODO : make sure it works
            onChange: (value: number) => {
                if (this._.lowerCanvasEl)
                    this._.setDimensions({ width: value })
                this._.renderAll()
            }, property: { type: "number", value: this._.getWidth(), step: 5 }, value: this._.getWidth(), UIComponent: <div>
                <InputNumber min={100} step={5} value={this._.getWidth()} onChange={(value) => {
                    if (this._.lowerCanvasEl)
                        this._.setDimensions({ width: value })
                    this._.renderAll()
                }} />
            </div>
        })

        // set Canvas Height
        availablePropertyList.push({
            inputType: "number", name: "canvasHeight",
            // TODO : make sure it works
            onChange: (value: number) => {
                this._.setDimensions({ height: value })
                this._.renderAll()
            }, property: { type: "number", value: this._.getHeight(), step: 5 }, value: this._.getHeight(), UIComponent: <div>
                <InputNumber min={100} step={5} value={this._.getHeight()} onChange={(value) => {
                    if (this._.lowerCanvasEl)
                        this._.setDimensions({ height: value })
                    this._.renderAll()
                }} />
            </div>
        })

        // set Canvas Background
        availablePropertyList.push({
            inputType: "color", name: "CanvasBackground", onChange: (value: string) => {
                this._.set("backgroundColor", value)
                this._.renderAll()
            }, property: { type: "color", value: this._.get("backgroundColor") }, value: this._.get("backgroundColor"), UIComponent: <div>
                <InputColor value={String(this._.get("backgroundColor"))} onChange={(value) => {
                    this._.set("backgroundColor", value)
                    this._.renderAll()
                }} />
            </div>
        })

        availablePropertyList.push(...Object.keys(this.propertyValueList).map((property: string): availablePropertyType => {
            return {
                name: property,
                inputType: "number",
                property: this.propertyValueList[property],
                value: this.propertyValueList[property].value,
                onChange: (value: any) => { this.updatePropertyValue(property, value) },
                UIComponent: <div>
                    {this.propertyValueList[property].type === "number" && <InputNumber min={this.propertyValueList[property].min} value={(typeof this.propertyValueList[property].value) === "number" ? this.propertyValueList[property].value : undefined} onChange={(value) => this.updatePropertyValue(property, value)} />}
                    {this.propertyValueList[property].type === "range" && <InputRange max={this.propertyValueList[property].max} step={this.propertyValueList[property].step} min={this.propertyValueList[property].min} value={this.propertyValueList[property].value} onChange={(value) => this.updatePropertyValue(property, value)} />}
                    {this.propertyValueList[property].type === "color" && <InputColor value={String(this.propertyValueList[property].value)} onChange={(value) => this.updatePropertyValue(property, value)} />}
                    {this.propertyValueList[property].type === "enum" && <InputSelect options={this.propertyValueList[property].enum?.map(val => ({ value: val, displayValue: val })) || []} value={{ value: this.propertyValueList[property].enum?.[0] || "", displayValue: this.propertyValueList[property].enum?.[0] || "", }} onChange={(value) => this.updatePropertyValue(property, value.value)} />}
                    {this.propertyValueList[property].type === "font" && <InputSelect options={this.fonts.map((font => ({ value: font.name, displayValue: font.name })))} value={{ value: this.propertyValueList[property].value, displayValue: this.propertyValueList[property].value, }} onChange={(value) => this.updatePropertyValue(property, value.value)} />}
                </div>
            }
        }))




        return availablePropertyList;
    }

    constructor({ fabricCanvasInstance, fontList }: { fabricCanvasInstance: Canvas, fontList: FontInfo[] }) {

        // initialize the base state
        this.selectedTool = "select"


        // base canvas instance
        this._ = fabricCanvasInstance
        this.fonts = fontList


        // listening events
        this._.on("selection:cleared", this.updateSelectedObjPropertyList.bind(this))
        this._.on("selection:created", this.updateSelectedObjPropertyList.bind(this))
        this._.on("selection:updated", this.updateSelectedObjPropertyList.bind(this))
        this._.on("object:modified", this.updateSelectedObjPropertyList.bind(this))




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
                        fill: this.drawColor,
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

                        originX: "left",
                        originY: "top",
                        // strokeWidth: 1,

                    });
                else
                    obj = new Textbox("", {
                        left: origX,
                        top: origY,
                        textFill: this.drawColor, // Default fill color
                        // stroke: "red",
                        // strokeWidth: 1,
                        // borderColor: "blue",
                        selectable: true,
                        originX: "left",
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
            let canvasWidth = this._.getWidth(), canvasHeight = this._.getHeight()

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

    private alignObject(val: objPositionType) {
        const activeObjects = this._.getActiveObjects();
        if (activeObjects.length < 1) return;
        this._.discardActiveObject()
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
                    activeObject.setX(this._.width - activeObject.width * activeObject.scaleX)
                    break;
                case "top":
                    activeObject.set("originY", "top")
                    activeObject.setY(0)
                    break;
                case "bottom":
                    activeObject.set("originY", "top")
                    activeObject.setY(this._.height - activeObject.height * activeObject.scaleY)
                    break;
                case "horizontally":
                    this._.centerObjectH(activeObject)
                    break;
                case "vertically":
                    this._.centerObjectV(activeObject)
                    break;
            }
        })
        this._.setActiveObject(new ActiveSelection(activeObjects))
        this._.renderAll();
    }

    private moveObject(val: objMoveType) {
        const activeObject = this._.getActiveObject();
        if (!activeObject) return;
        switch (val) {
            case 2:
                this._.bringObjectToFront(activeObject)
                break;
            case 1:
                this._.bringObjectForward(activeObject)
                break;
            case -1:
                this._.sendObjectBackwards(activeObject)
                break;
            case -2:
                this._.sendObjectToBack(activeObject)
                break;
        }
        this._.renderAll();
    }

    /**
    * Selects the active drawing tool
    * @param tool - Tool to select (select, rect, elipse, text)
    */
    @action
    selectTool(tool: toolListType) {
        this.selectedTool = tool
    }
    /**
     * Deletes the currently selected element(s) from the canvas
     * can be used with delete button
     */
    private deleteActiveElement() {
        this._.getActiveObjects()
            .forEach((obj) => {
                this._.remove(obj)
            })
        this._.discardActiveObject()
        this.updateSelectedObjPropertyList()
        this._.renderAll()
    }


    /**
     * Extracts only the keys common to all objects, with values from the last object.
     * @param data Array of value objects.
     * @returns Object with only common keys and last object's full value.
     */
    private extractCommonKeyFullValues(data: FabricObjectPropertyList[]): FabricObjectPropertyList {
        if (data.length === 0) return {};

        // Step 1: Find common keys
        const commonKeys = Object.keys(data[0]).filter(key =>
            data.every(obj => key in obj)
        );

        // Step 2: Build the result using values from the last object
        const last = data[data.length - 1];
        const result: FabricObjectPropertyList = {};

        for (const key of commonKeys) {
            result[key] = last[key];
        }

        return result;
    }

    /**
     * Updates the property list
     * method invoked when selected objects change using event listener
     */
    @action
    private updateSelectedObjPropertyList() {

        this.propertyValueList = {}

        if (!this._) {
            this.propertyValueList = {}
            return
        }

        const objs = this._.getActiveObjects()
        if (objs.length == 0) {
            this.propertyValueList = {}
            return
        }

        const objOptions = objs.map(v => FabricObjectAdapter.createAdapter(v.type, v).getObjectValues())
        const finalPropertyList = this.extractCommonKeyFullValues(objOptions)

        this.propertyValueList = finalPropertyList
    }
    /**
         * Updates a property value for the selected object(s)
         * @param propertyKey - Name of the property to update
         * @param value - New value to set
         */
    @action
    updatePropertyValue = (propertyKey: string, value: any) => {

        if (!this._) return;
        const selectedObj = this._.getActiveObjects()

        selectedObj.forEach(obj => {
            const objAdapter = FabricObjectAdapter.createAdapter(obj.type, obj)
            objAdapter.propertyListMap[propertyKey](value)
            // obj.set("hasBorders", false);
            obj.setCoords()
        })

        this.propertyValueList = { ...this.propertyValueList, [propertyKey]: { ...this.propertyValueList[propertyKey], value } }
        this._.renderAll()
    }
    /**
     * Exports the canvas state as JSON
     * @returns JSON string representation of the canvas
     */
    exportJSON(): string {
        return this._.toJSON()
    }
    /**
     * Imports a canvas state from JSON
     * @param json - JSON string to import
     */
    importJSON(json: string) {
        return this._.loadFromJSON(json, () => {
            this._.renderAll()
        })
    }
}

