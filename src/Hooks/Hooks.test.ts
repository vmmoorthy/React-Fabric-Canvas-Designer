import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import useGoogleFontsLoader from './useGoogleFontsLoader';
import useReactFabricCanvas from './useReactFabricCanvas';

global.fetch = jest.fn(() =>
    Promise.resolve({
        text: () =>
            Promise.resolve(`
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          src: url(https://fonts.gstatic.com/s/roboto/v47/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3GUBGEe.woff2);
        }
      `),
    })
) as jest.Mock;

const fontList = [{ name: "Arial", weights: [400], styles: ["normal"] }]

global.FontFace = jest.fn().mockImplementation((family, source) => {
    return {
        family,
        source,
        load: jest.fn().mockResolvedValue(true),
    };
});

Object.defineProperty(document, 'fonts', {
    value: {
        add: jest.fn(),
    },
    writable: false,
});


describe("Hooks", () => {

    test("useGoogleFontsLoader should load fonts", async () => {
        const { result, rerender } = renderHook(() =>
            useGoogleFontsLoader(
                "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            )
        );

        expect(result.current.fonts.length).toBe(0);

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.fonts.length).toBeGreaterThan(0);
    });

    test("useReactFabricCanvas should initialize canvas", async () => {
        const { result } = renderHook(() =>
            useReactFabricCanvas({
                canvasWidth: 800,
                canvasHeight: 600,
                backgroundColor: "#ffffff",
                fontList,
            })
        );

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
        expect(result.current.fabricCanvasInstance).not.toBeNull();
        expect(result.current.UIComponent).toBeDefined();
    });
});
