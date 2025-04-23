import { useEffect, useState } from "react";
import { FontInfo } from "../types";


export default function useGoogleFontsLoader(cssUrl: string) {
    const [fonts, setFonts] = useState<FontInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                const res = await fetch(cssUrl);
                const cssText = await res.text();

                const fontFaceRegex = /@font-face\s*{[^}]*}/g;
                const matches = cssText.match(fontFaceRegex) || [];

                const fontMap = new Map<string, { weights: Set<number>, styles: Set<string> }>();

                const fontFacePromises: Promise<FontFace>[] = [];

                for (const block of matches) {
                    const fontFamily = block.match(/font-family:\s*['"]?([^;'"]+)['"]?;/)?.[1];
                    const fontStyle = block.match(/font-style:\s*([^;]+);/)?.[1] || "normal";
                    const fontWeightStr = block.match(/font-weight:\s*([^;]+);/)?.[1] || "400";
                    const fontSrcMatch = block.match(/src:\s*url\(([^)]+)\)/);
                    const fontWeight = parseInt(fontWeightStr, 10);

                    const fontSrc = fontSrcMatch ? fontSrcMatch[1] : "";

                    if (fontFamily && fontSrc) {
                        const fontFace = new FontFace(fontFamily, `url(${fontSrc})`, {
                            style: fontStyle,
                            weight: fontWeightStr,
                        });

                        fontFacePromises.push(fontFace.load());

                        if (!fontMap.has(fontFamily)) {
                            fontMap.set(fontFamily, {
                                weights: new Set(),
                                styles: new Set(),
                            });
                        }

                        fontMap.get(fontFamily)?.weights.add(fontWeight);
                        fontMap.get(fontFamily)?.styles.add(fontStyle);
                    }
                }

                await Promise.all(fontFacePromises).then(loadedFonts => {
                    loadedFonts.forEach(font => {
                        (document as any).fonts.add(font);
                    });
                });

                const parsedFonts: FontInfo[] = [];
                for (const [name, data] of fontMap.entries()) {
                    parsedFonts.push({
                        name,
                        weights: Array.from(data.weights).sort((a, b) => a - b),
                        styles: Array.from(data.styles),
                    });
                }

                setFonts(parsedFonts);
            } catch (err) {
                console.error("Failed to load fonts:", err);
            } finally {
                setLoading(false);
            }
        };

        loadFonts();
    }, [cssUrl]);

    return { fonts, loading };
}
