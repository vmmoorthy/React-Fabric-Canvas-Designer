
import { Canvas } from 'fabric';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactFabricStore } from '../ReactFabricStore';
type props = {
    canvasWidth: number,
    canvasHeight: number,
    backgroundColor: string,
}

const useReactFabricCanvas = ({ canvasWidth, canvasHeight, backgroundColor }: props) => {
    const canvasEl = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
    const [fabricCanvasInstance, setFabricCanvasInstance] = useState<Canvas>(() => new Canvas());

    const reactFabricStore = useMemo(() => {
        return new ReactFabricStore({ fabricCanvasInstance })
    }, [fabricCanvasInstance])

    useEffect(() => {
        let initcanvas: null | Canvas = null

        if (!canvasEl.current) return;
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
    }, [])

    return { fabricCanvasInstance, reactFabricStore, UIComponent: <canvas ref={canvasEl} style={{ border: '1px solid black' }} /> }

}

export default useReactFabricCanvas;