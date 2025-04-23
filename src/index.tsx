import Chrome from "@uiw/react-color-chrome";
import { observer } from "mobx-react-lite";
import useGoogleFontsLoader from "./Hooks/useGoogleFontsLoader";
import useReactFabricCanvas from "./Hooks/useReactFabricCanvas";
import './index.css';
import { FontInfo } from "./types/types";



export { useGoogleFontsLoader, useReactFabricCanvas };


export { Chrome };

export { observer } from "mobx-react-lite";


export type { FontInfo };

export default { useReactFabricCanvas, useGoogleFontsLoader, Chrome, observer, }
