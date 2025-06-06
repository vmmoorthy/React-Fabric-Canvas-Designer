import { Canvas } from 'fabric';
import { useEffect, useRef } from 'react';
type props = {
    canvasWidth: number,
    canvasHeight: number,
    backgroundColor: string,
}

export const CanvasRenderer = ({ canvasWidth, canvasHeight, backgroundColor }: props) => {
    const canvasEl = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
    const fabricCanvasInstance = useRef<Canvas>({} as Canvas);

    useEffect(() => {

        if (!canvasEl.current) return;
        fabricCanvasInstance.current = new Canvas(canvasEl.current, {
            canvasWidth,
            canvasHeight,
            backgroundColor,
            preserveObjectStacking: true
        });
        fabricCanvasInstance.current.renderAll();

        return () => {
            if (!fabricCanvasInstance.current) return;
            fabricCanvasInstance.current.dispose()
        }

    }, [])

    return { fabricCanvasInstance, UIComponent: <canvas ref={canvasEl} style={{ border: '1px solid black' }} /> }
}