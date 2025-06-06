
import { Canvas } from 'fabric';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactFabricStore } from '../ReactFabricStore';
import { FontInfo } from '../types/types';
type props = {
    canvasWidth: number,
    canvasHeight: number,
    backgroundColor: string,
    fontList: FontInfo[]
}

const useReactFabricCanvas = ({ canvasWidth, canvasHeight, backgroundColor, fontList }: props) => {
    const canvasEl = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
    const [fabricCanvasInstance, setFabricCanvasInstance] = useState<Canvas | null>(null);

    const reactFabricStore = useMemo<ReactFabricStore | null>(() => {
        if (fabricCanvasInstance)
            return new ReactFabricStore({ fabricCanvasInstance, fontList })
        return null
    }, [fabricCanvasInstance, fontList])

    useEffect(() => {
        let initcanvas: null | Canvas = null

        if (!canvasEl.current) return;
        canvasEl.current.width = canvasWidth;
        canvasEl.current.height = canvasHeight;
        initcanvas = new Canvas(canvasEl.current, {
            canvasWidth,
            canvasHeight,
            backgroundColor,
            preserveObjectStacking: true
        });
        initcanvas.renderAll();
        setFabricCanvasInstance(initcanvas)
        return () => {
            initcanvas.dispose()
        }
    }, [fontList])

    return { fabricCanvasInstance, reactFabricStore, UIComponent: <canvas ref={canvasEl} width={canvasWidth} height={canvasHeight} /> }

}

export default useReactFabricCanvas;