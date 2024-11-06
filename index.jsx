import { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas, Rect, FabricImage, IText, Textbox, Ellipse } from 'fabric';
import * as fabric from 'fabric'
import ColorDropdown from './ColorInput.jsx';
// import qr from './qr.webp'
import { QRCodeCanvas } from 'qrcode.react'



const CanvasComponent = ({ initialValue, qr, parentCanvasRef, listEmbeddings = [] }) => {
    const [canvas, setCanvas] = useState();
    const canvasEl = useRef();
    const paintInfoRef = useRef({ isDrawing: false, drawColor: "blue" })
    const toolRef = useRef("select")
    const [initialData] = useState(initialValue)
    const selectedObjs = useRef([])
    const [{ canvasWidth, canvasHeight, canvasBackgroundColor }, setCanvasProperties] = useState({ canvasWidth: 1056, canvasHeight: 816, canvasBackgroundColor: "white" });
    const [propVisibilityList, setPropVisibilityList] = useState([]);
    const [toolProperties, setToolProperties] = useState({ fontSize: 16, fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal", underline: false, alignment: "left", textColor: "#000000ff", backgroundColor: "#ffffffff", textAlign: "left" });
    const [tool, sTool] = useState("select");
    console.log(propVisibilityList);

    // const fabricCanvasRef = useRef();
    const setTool = (tool) => {
        toolRef.current = tool
        sTool(tool)
    }
    useEffect(() => {
        if (!canvas) return
        const activeObj = canvas.getActiveObject()
        if (!activeObj) return;
        // activeObj.fontSize = toolProperties.fontSize
        activeObj.set("fontSize", toolProperties.fontSize)
        activeObj.set("fontFamily", toolProperties.fontFamily)
        activeObj.set("textAlign", toolProperties.textAlign)
        canvas.renderAll()
        console.log(activeObj);

    }, [toolProperties])
    useEffect(() => {
        if (!canvas) return;
        parentCanvasRef.current = canvas
        retrive(initialData)
    }, [parentCanvasRef, canvas])
    useEffect(() => {
        if (!canvas) return;
        // Initialize Fabric.js canvas

        console.log(canvas);


        let obj, origX, origY;


        // Handle mouse click to create rectangle
        canvas.on('mouse:down', (options) => {
            if (toolRef.current === "select") return;

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

                        originX: "left",
                        originY: "top",
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

                        originX: "left",
                        originY: "top",
                        // strokeWidth: 1,

                        width: 0,
                        height: 0,
                        fontSize: 20,
                        // lockScalingY: true,


                    });
                obj.set({ "strokeUniform": true });
                canvas.add(obj);
                canvas.setActiveObject(obj);

            }
            canvas.renderAll()


        });

        canvas.on('mouse:move', (options) => {
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
            // if (tool === "select") return
            // isDrawingRef.current = true
            // if (options.e) {
            //     if (x < origX) rect.set({ left: x });
            //     if (y < origY) rect.set({ top: y });

            //     rect.set({
            //         width: Math.abs(origX - x),
            //         height: Math.abs(origY - y),
            //     });


            // }
            // canvas.renderAll()
        });

        canvas.on('mouse:up', (options) => {
            paintInfoRef.current.isDrawing = false
            if (toolRef.current == "text") {
                const activeObject = canvas.getActiveObject();
                activeObject.enterEditing()
            }


            setTool("select")

            canvas.renderAll()
            // if (!isDrawingRef.current) return;
            // console.log(options);

            // if (tool === "select") return
            // isDrawingRef.current = true
            // console.log(options);
            // if (options.e) {
            //     const pointer = canvas.getPointer(options.e);
            //     let x = pointer.x, y = pointer.y;
            //     if (x < origX) rect.set({ left: x });
            //     if (y < origY) rect.set({ top: y });

            //     rect.set({
            //         width: Math.abs(origX - x),
            //         height: Math.abs(origY - y),
            //     });


            // }
            // canvas.renderAll()
        });

        // canvas.renderAll()

        canvas?.on("selection:cleared", (e) => {
            console.log(e)
            selectedObjs.current = []
            // e.deselected.forEach((ele) => {
            //     ele.opacity = 1
            // })
            console.log(selectedObjs.current);
            setPropertyList()
            // canvas.requestRenderAll()
        })
        canvas?.on("selection:created", e => {
            console.log(e)
            selectedObjs.current = e.selected
            console.log(selectedObjs.current);
            setPropertyList()
            // canvas.requestRenderAll()
        })

        canvas?.on("selection:updated", (e) => {
            console.log(e)
            selectedObjs.current = selectedObjs.current.filter(obj => {
                return e.deselected.findIndex((deselObj) => deselObj == obj) == -1
            })
            selectedObjs.current.push(...e.selected)
            // e.selected
            console.log(selectedObjs.current);

            setPropertyList()
            // canvas.requestRenderAll()
        })
        // canvas.on('mouse:down', (options) => {
        //     if (options.e) {
        //         const pointer = canvas.getPointer(options.e);
        //         const rect = new Rect({
        //             left: pointer.x,
        //             top: pointer.y,
        //             fill: 'blue', // Default fill color
        //             width: 100,
        //             height: 50,
        //             selectable: true,
        //         });
        //         canvas.add(rect);
        //     }
        // });


        // Handle keyboard events for deletion
        const handleWheel = (event) => {
            console.log(event);

            event.e.preventDefault();
            const delta = event.e.deltaY;
            let zoom = canvas.getZoom();

            // Calculate new zoom level
            zoom *= 0.999 ** delta;

            // Limit zoom level
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;

            // Get mouse position relative to canvas
            const pointer = canvas.getPointer(event.e);
            const point = new fabric.Point(pointer.x, pointer.y);

            // Set zoom with point as origin
            canvas.zoomToPoint(point, zoom);
        };

        window.addEventListener('paste', handlePaste);
        window.addEventListener('keydown', handleKeyDown);
        // if (canvas)
        //     canvas.on("after:render", () => {
        //         onChange(getJsonData())
        //     })
        //     canvas.on('mouse:wheel', handleWheel);
        // canvas.renderAll.bind(canvas)
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('paste', handlePaste);
            // if (canvasEl.current)
            //     canvasEl.current.removeEventListener('wheel', handleWheel);

            canvas.off("mouse:down")
            canvas.off("mouse:move")
            canvas.off("mouse:up")
            // canvas.off("mouse:wheel")
            canvas.dispose();

        };
    }, [canvas]);


    const handlePaste = function (e) {
        console.log(e);

        var items = e.clipboardData.items;
        console.log(items);

        for (var i = 0; i < items.length; i++) {
            console.log(items[i]);

            if (items[i].type === 'image/svg+xml') {
                items[i].getAsString(function (svgString) {
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
                    imgObj.src = event.target.result;
                    console.log(imgObj);

                    imgObj.onload = function () {
                        loadImgToCanvas(imgObj)
                    }
                };
                reader.readAsDataURL(blob);
            }
        }
    }

    // const handlePaste = function (e) {
    //     const clipboardData = e.clipboardData;
    //     const items = clipboardData.items;
    //     const types = Array.from(clipboardData.types);
    //     console.log('Available clipboard formats:', types);

    //     // First check for RTF content
    //     if (types.includes('text/rtf')) {
    //         const rtfContent = clipboardData.getData('text/rtf');
    //         const plainText = clipboardData.getData('text/plain');
    //         console.log('RTF Content:', rtfContent);
    //         console.log('Text Content:', plainText);
    //         handleRtfPaste(rtfContent, plainText, e);
    //     }
    //     // Then check for HTML content
    //     // else if (types.includes('text/html')) {
    //     //     handleHtmlPaste(clipboardData.getData('text/html'), e);
    //     // }
    //     // Then check for images
    //     else {
    //         for (let item of items) {
    //             if (item.type.indexOf('image') !== -1) {
    //                 handleImagePaste(item, e);
    //                 return;
    //             }
    //         }
    //         // Finally, fall back to plain text
    //         if (types.includes('text/plain')) {
    //             handlePlainTextPaste(clipboardData.getData('text/plain'), e);
    //         }
    //     }

    //     // Prevent the default paste behavior
    //     e.preventDefault();
    // };

    // const handleRtfPaste = (rtfContent, plainText, e) => {
    //     const formattingInfo = parseRtfContent(rtfContent, plainText);
    //     console.log('Parsed RTF formatting:', formattingInfo);

    //     // Create text object with all extracted formatting
    //     const textbox = new fabric.IText(formattingInfo.text, {
    //         left: 100,
    //         top: 100,
    //         width: 300,
    //         fontSize: formattingInfo.fontSize,
    //         fontFamily: formattingInfo.fontFamily,
    //         fill: formattingInfo.color,
    //         backgroundColor: formattingInfo.highlight,
    //         fontWeight: formattingInfo.bold ? 'bold' : 'normal',
    //         fontStyle: formattingInfo.italic ? 'italic' : 'normal',
    //         underline: formattingInfo.underline,
    //         linethrough: formattingInfo.strikethrough,
    //         textAlign: formattingInfo.alignment,
    //         charSpacing: formattingInfo.characterSpacing,
    //         lineHeight: formattingInfo.lineSpacing,
    //         angle: formattingInfo.textRotation,
    //         opacity: formattingInfo.opacity,
    //         selectable: true,
    //         editable: true
    //     });

    //     // Apply any additional styles specific to your needs
    //     if (formattingInfo.styles) {
    //         textbox.set('styles', formattingInfo.styles);
    //     }

    //     canvas.add(textbox);
    //     canvas.renderAll();
    // };
    // const handleRtfPaste = (rtfContent, e) => {
    //     console.log(rtfContent);

    //     // Parse RTF content to extract formatting
    //     const formattingInfo = parseRtfContent(rtfContent);
    //     console.log(formattingInfo);

    //     // Create a new Fabric.js IText object with the extracted formatting
    //     const textbox = new IText(formattingInfo.text, {
    //         left: 100,
    //         top: 100,
    //         width: 300,
    //         fontSize: formattingInfo.fontSize || 16,
    //         fontFamily: formattingInfo.fontFamily || 'Arial',
    //         fill: formattingInfo.color || '#000000',
    //         fontWeight: formattingInfo.bold ? 'bold' : 'normal',
    //         fontStyle: formattingInfo.italic ? 'italic' : 'normal',
    //         underline: formattingInfo.underline,
    //         textAlign: formattingInfo.alignment || 'left',
    //         backgroundColor: formattingInfo.backgroundColor || '',
    //         selectable: true,
    //         editable: true
    //     });

    //     canvas.add(textbox);
    //     canvas.renderAll();
    // };
    // const parseRtfContent = (rtfContent, plainText) => {
    //     // Initialize default formatting object
    //     const formatting = {
    //         text: plainText || '',           // Default to plain text
    //         fontSize: 16,                    // Default font size
    //         fontFamily: 'Arial',             // Default font
    //         color: '#000000',               // Default color
    //         highlight: '',                  // Background color
    //         bold: false,
    //         italic: false,
    //         underline: false,
    //         strikethrough: false,
    //         superscript: false,
    //         subscript: false,
    //         alignment: 'left',
    //         characterSpacing: 0,
    //         lineSpacing: 1,
    //         textRotation: 0,
    //         opacity: 1,
    //         indent: 0,
    //         styles: {},                     // For character-level formatting
    //         language: 'en',
    //         margins: {
    //             left: 0,
    //             right: 0,
    //             top: 0,
    //             bottom: 0
    //         }
    //     };

    //     try {
    //         // Font Tables
    //         const fontTable = new Map();
    //         const fontTableMatch = rtfContent.match(/\{\\fonttbl(.+?)\}/);
    //         if (fontTableMatch) {
    //             const fontEntries = fontTableMatch[1].match(/\\f\d+\s+\\[^;]+[^}]+?;/g);
    //             if (fontEntries) {
    //                 fontEntries.forEach(entry => {
    //                     const fontId = entry.match(/\\f(\d+)/)?.[1];
    //                     const fontName = entry.match(/\\[^\\{}\s]+\s+([^;]+);/)?.[1];
    //                     if (fontId && fontName) {
    //                         fontTable.set(parseInt(fontId), fontName.trim());
    //                     }
    //                 });
    //             }
    //         }

    //         // Color Table
    //         const colorTable = [];
    //         const colorTableMatch = rtfContent.match(/\{\\colortbl;(.+?)\}/);
    //         if (colorTableMatch) {
    //             const colorEntries = colorTableMatch[1].match(/\\red\d+\\green\d+\\blue\d+;/g);
    //             if (colorEntries) {
    //                 colorEntries.forEach(entry => {
    //                     const red = entry.match(/\\red(\d+)/)?.[1] || 0;
    //                     const green = entry.match(/\\green(\d+)/)?.[1] || 0;
    //                     const blue = entry.match(/\\blue(\d+)/)?.[1] || 0;
    //                     colorTable.push(`#${[red, green, blue]
    //                         .map(n => parseInt(n).toString(16).padStart(2, '0'))
    //                         .join('')}`);
    //                 });
    //             }
    //         }

    //         // Font Size (in half-points)
    //         const fontSize = rtfContent.match(/\\fs(\d+)/);
    //         if (fontSize) {
    //             formatting.fontSize = parseInt(fontSize[1]) / 2;
    //         }

    //         // Font Family
    //         const fontFamily = rtfContent.match(/\\f(\d+)/);
    //         if (fontFamily && fontTable.has(parseInt(fontFamily[1]))) {
    //             formatting.fontFamily = fontTable.get(parseInt(fontFamily[1]));
    //         }

    //         // Text Color
    //         const colorIndex = rtfContent.match(/\\cf(\d+)/);
    //         if (colorIndex && colorTable[parseInt(colorIndex[1]) - 1]) {
    //             formatting.color = colorTable[parseInt(colorIndex[1]) - 1];
    //         }

    //         // Background Color (Highlight)
    //         const highlightIndex = rtfContent.match(/\\highlight(\d+)/);
    //         if (highlightIndex && colorTable[parseInt(highlightIndex[1]) - 1]) {
    //             formatting.highlight = colorTable[parseInt(highlightIndex[1]) - 1];
    //         }

    //         // Basic Formatting
    //         formatting.bold = rtfContent.includes('\\b') && !rtfContent.includes('\\b0');
    //         formatting.italic = rtfContent.includes('\\i') && !rtfContent.includes('\\i0');
    //         formatting.underline = rtfContent.includes('\\ul') && !rtfContent.includes('\\ul0');
    //         formatting.strikethrough = rtfContent.includes('\\strike') && !rtfContent.includes('\\strike0');
    //         formatting.superscript = rtfContent.includes('\\super') && !rtfContent.includes('\\super0');
    //         formatting.subscript = rtfContent.includes('\\sub') && !rtfContent.includes('\\sub0');

    //         // Alignment
    //         if (rtfContent.includes('\\qc')) formatting.alignment = 'center';
    //         if (rtfContent.includes('\\qr')) formatting.alignment = 'right';
    //         if (rtfContent.includes('\\qj')) formatting.alignment = 'justify';

    //         // Spacing
    //         const charSpacing = rtfContent.match(/\\expnd(\d+)/);
    //         if (charSpacing) {
    //             formatting.characterSpacing = parseInt(charSpacing[1]) / 4;
    //         }

    //         const lineSpacing = rtfContent.match(/\\sl(\d+)/);
    //         if (lineSpacing) {
    //             formatting.lineSpacing = parseInt(lineSpacing[1]) / 240;
    //         }

    //         // Rotation
    //         const rotation = rtfContent.match(/\\absrot(\d+)/);
    //         if (rotation) {
    //             formatting.textRotation = parseInt(rotation[1]);
    //         }

    //         // Opacity
    //         const opacity = rtfContent.match(/\\opacity(\d+)/);
    //         if (opacity) {
    //             formatting.opacity = parseInt(opacity[1]) / 10000;
    //         }

    //         // Indentation
    //         const indent = rtfContent.match(/\\fi(\-?\d+)/);
    //         if (indent) {
    //             formatting.indent = parseInt(indent[1]) / 20;
    //         }

    //         // Margins
    //         const leftMargin = rtfContent.match(/\\margl(\d+)/);
    //         if (leftMargin) {
    //             formatting.margins.left = parseInt(leftMargin[1]) / 20;
    //         }

    //         const rightMargin = rtfContent.match(/\\margr(\d+)/);
    //         if (rightMargin) {
    //             formatting.margins.right = parseInt(rightMargin[1]) / 20;
    //         }

    //         // Language
    //         const language = rtfContent.match(/\\lang(\d+)/);
    //         if (language) {
    //             formatting.language = getLangCode(parseInt(language[1]));
    //         }

    //         // Parse Text Content if plain text is not available
    //         if (!plainText) {
    //             let text = rtfContent
    //                 // Remove RTF headers and groups
    //                 .replace(/\{\\rtf1.*?\\viewkind\d\\uc1\s?/g, '')
    //                 // Remove color table
    //                 .replace(/\{\\colortbl.*?\}/g, '')
    //                 // Remove font table
    //                 .replace(/\{\\fonttbl.*?\}/g, '')
    //                 // Remove other control groups
    //                 .replace(/\{\\*\\[^{}]+\}/g, '')
    //                 // Remove control words
    //                 .replace(/\\[a-zA-Z]+\d*/g, '')
    //                 // Remove remaining braces
    //                 .replace(/[{}]/g, '')
    //                 // Remove escape characters
    //                 .replace(/\\\\/g, '\\')
    //                 .replace(/\\([^\\])/g, '$1')
    //                 // Clean up whitespace
    //                 .replace(/\s+/g, ' ')
    //                 .trim();

    //             if (text) {
    //                 formatting.text = text;
    //             }
    //         }

    //         // Parse Character-Level Formatting
    //         // This is more complex and requires tracking formatting changes through the document
    //         const charFormats = [];
    //         let currentPos = 0;
    //         const formatMatches = rtfContent.matchAll(/\\([a-zA-Z]+)(\d*)/g);

    //         for (const match of formatMatches) {
    //             const [fullMatch, command, value] = match;
    //             const pos = match.index;

    //             if (['b', 'i', 'ul', 'strike', 'cf', 'fs'].includes(command)) {
    //                 charFormats.push({
    //                     pos,
    //                     command,
    //                     value: value || true
    //                 });
    //             }
    //         }

    //         // Sort formats by position
    //         charFormats.sort((a, b) => a.pos - b.pos);

    //         // Convert character formats to Fabric.js styles object
    //         const styles = {};
    //         let currentStyle = {};

    //         charFormats.forEach(format => {
    //             const charIndex = getTextIndexFromRtfPosition(rtfContent, format.pos);
    //             if (charIndex >= 0) {
    //                 styles[0] = styles[0] || {};
    //                 styles[0][charIndex] = {
    //                     ...currentStyle,
    //                     ...(format.command === 'b' && { fontWeight: format.value ? 'bold' : 'normal' }),
    //                     ...(format.command === 'i' && { fontStyle: format.value ? 'italic' : 'normal' }),
    //                     ...(format.command === 'ul' && { underline: format.value }),
    //                     ...(format.command === 'strike' && { linethrough: format.value }),
    //                     ...(format.command === 'cf' && format.value && colorTable[parseInt(format.value) - 1] &&
    //                         { fill: colorTable[parseInt(format.value) - 1] }),
    //                     ...(format.command === 'fs' && { fontSize: parseInt(format.value) / 2 })
    //                 };
    //                 currentStyle = { ...styles[0][charIndex] };
    //             }
    //         });

    //         if (Object.keys(styles).length > 0) {
    //             formatting.styles = styles;
    //         }

    //     } catch (error) {
    //         console.error('Error parsing RTF:', error);
    //         formatting.text = plainText || rtfContent.replace(/[\\{}]/g, '').trim();
    //     }

    //     return formatting;
    // };

    // Helper function to convert LCID to language code
    // const getLangCode = (lcid) => {
    //     const langMap = {
    //         1033: 'en',    // English (United States)
    //         2057: 'en-GB', // English (United Kingdom)
    //         1034: 'es',    // Spanish
    //         1036: 'fr',    // French
    //         1031: 'de',    // German
    //         // Add more as needed
    //     };
    //     return langMap[lcid] || 'en';
    // };

    // Helper function to convert RTF position to text position
    // const getTextIndexFromRtfPosition = (rtfContent, rtfPos) => {
    //     const textBefore = rtfContent.substring(0, rtfPos)
    //         .replace(/\{\\rtf1.*?\\viewkind\d\\uc1\s?/g, '')
    //         .replace(/\{\\colortbl.*?\}/g, '')
    //         .replace(/\{\\fonttbl.*?\}/g, '')
    //         .replace(/\{\\*\\[^{}]+\}/g, '')
    //         .replace(/\\[a-zA-Z]+\d*/g, '')
    //         .replace(/[{}]/g, '')
    //         .replace(/\\\\/g, '\\')
    //         .replace(/\\([^\\])/g, '$1')
    //         .replace(/\s+/g, ' ')
    //         .trim();

    //     return textBefore.length;
    // };
    // const parseRtfContent = (rtfContent) => {
    //     // Initialize default formatting object
    //     const formatting = {
    //         text: '',
    //         fontSize: 16,
    //         fontFamily: '',
    //         color: '#000000',
    //         bold: false,
    //         italic: false,
    //         underline: false,
    //         alignment: 'left',
    //         backgroundColor: ''
    //     };

    //     try {
    //         // RTF parsing logic
    //         // This is a simplified version - you might want to use a proper RTF parser library

    //         // Extract font family
    //         const fontFamilyMatch = rtfContent.match(/\\fname\s*([^;{}\\]+)/);
    //         if (fontFamilyMatch) {
    //             formatting.fontFamily = fontFamilyMatch[1].trim();
    //         }

    //         // Extract font size (RTF stores size in half-points)
    //         const fontSizeMatch = rtfContent.match(/\\fs(\d+)/);
    //         if (fontSizeMatch) {
    //             formatting.fontSize = parseInt(fontSizeMatch[1]) / 2;
    //         }

    //         // Check for bold
    //         formatting.bold = rtfContent.includes('\\b');

    //         // Check for italic
    //         formatting.italic = rtfContent.includes('\\i');

    //         // Check for underline
    //         formatting.underline = rtfContent.includes('\\ul');

    //         // Extract color (RTF uses \red\green\blue format)
    //         const colorMatch = rtfContent.match(/\\colortbl.*?\\red(\d+)\\green(\d+)\\blue(\d+)/);
    //         if (colorMatch) {
    //             const [_, r, g, b] = colorMatch;
    //             formatting.color = `rgb(${r}, ${g}, ${b})`;
    //         }

    //         // Extract alignment
    //         if (rtfContent.includes('\\qc')) formatting.alignment = 'center';
    //         if (rtfContent.includes('\\qr')) formatting.alignment = 'right';
    //         if (rtfContent.includes('\\qj')) formatting.alignment = 'justify';

    //         // Extract text content (simplified)
    //         const textMatch = rtfContent.match(/[^\\{}\r\n]+$/);
    //         if (textMatch) {
    //             formatting.text = textMatch[0].trim();
    //         }

    //     } catch (error) {
    //         console.error('Error parsing RTF:', error);
    //         // Fall back to plain text if RTF parsing fails
    //         formatting.text = rtfContent.replace(/[\\{}]/g, '').trim();
    //     }

    //     return formatting;
    // };

    // const handleHtmlPaste = (htmlContent, e) => {
    //     // Create a temporary div to parse HTML content
    //     const temp = document.createElement('div');
    //     temp.innerHTML = htmlContent;

    //     // Extract styles from HTML
    //     const firstElement = temp.firstElementChild;
    //     const computedStyle = window.getComputedStyle(firstElement);

    //     const textbox = new IText(temp.textContent.trim(), {
    //         left: 100,
    //         top: 100,
    //         width: 300,
    //         fontSize: parseInt(computedStyle.fontSize) || 16,
    //         fontFamily: computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '') || 'Arial',
    //         fill: computedStyle.color || '#000000',
    //         fontWeight: computedStyle.fontWeight,
    //         fontStyle: computedStyle.fontStyle,
    //         textAlign: computedStyle.textAlign || 'left',
    //         backgroundColor: computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ? computedStyle.backgroundColor : '',
    //         selectable: true,
    //         editable: true
    //     });

    //     canvas.add(textbox);
    //     canvas.renderAll();
    // };

    // const handleImagePaste = (item, e) => {
    //     const blob = item.getAsFile();
    //     const reader = new FileReader();

    //     reader.onload = function (event) {
    //         const imgObj = new Image();
    //         imgObj.src = event.target.result;

    //         imgObj.onload = function () {
    //             loadImgToCanvas(imgObj);
    //         };
    //     };

    //     reader.readAsDataURL(blob);
    // };

    // const handlePlainTextPaste = (textContent, e) => {
    //     // Create a simple textbox with default formatting
    //     const textbox = new IText(textContent.trim(), {
    //         left: 100,
    //         top: 100,
    //         width: 300,
    //         fontSize: 16,
    //         fontFamily: 'Arial',
    //         fill: '#000000',
    //         selectable: true,
    //         editable: true
    //     });

    //     canvas.add(textbox);
    //     canvas.renderAll();
    // };

    // Keep your existing loadImgToCanvas function
    const loadImgToCanvas = (imgElement, e = null) => {
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
        // if (canvas) return;
        console.log(canvasEl.current);

        const canvas = new Canvas(canvasEl.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: 'white',
            preserveObjectStacking: true
        });
        setCanvas(canvas)
        // canvas.renderAll()

        return () => {
            canvas.dispose()
        }
    }, [])
    const handleBackgroundColorChange = (color) => {
        console.log(color);

        paintInfoRef.current.drawColor = color
        // if (selectedObjs.current.length>0)
        // selectedObjs.current.forEach(ele => {
        //     ele.fill = e.target.value
        // })
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        console.log(activeObject);

        if (activeObject) {

            activeObject.textBackgroundColor = color
            canvas.renderAll()
        }
    }
    const handleTextColorChange = (color) => {
        console.log(color);

        paintInfoRef.current.drawColor = color
        // if (selectedObjs.current.length>0)
        // selectedObjs.current.forEach(ele => {
        //     ele.fill = e.target.value
        // })
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        console.log(activeObject);

        if (activeObject) {

            activeObject.fill = color
            canvas.renderAll()
        }
    }

    const handleFileUploads = (e) => {
        console.log(e);

        if (!e.target.files || e.target.files.length <= 0) {
            return;
        }

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // setBgImgSrc((reader.result as string) || "");
            const imgElement = new Image();
            imgElement.src = reader.result || "";
            imgElement.onload = () => loadImgToCanvas(imgElement, e)
        };
        reader.readAsDataURL(file);
    }
    // const loadImgToCanvas = (imgElement, e = null) => {
    //     const canvasWidth = canvas.width;
    //     const canvasHeight = canvas.height;
    //     let imgWidth = imgElement.naturalWidth;
    //     let imgHeight = imgElement.naturalHeight;
    //     console.log(imgWidth, imgHeight);

    //     // Check if the image exceeds canvas dimensions
    //     if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
    //         const widthRatio = canvasWidth / imgWidth;
    //         const heightRatio = canvasHeight / imgHeight;
    //         const ratio = Math.min(widthRatio, heightRatio);
    //         imgWidth *= ratio;
    //         imgHeight *= ratio;
    //     }

    //     const imgInstance = new FabricImage(imgElement, {
    //         left: 100,
    //         top: 100,
    //         selectable: true,
    //         scaleX: imgWidth / imgElement.naturalWidth,
    //         scaleY: imgHeight / imgElement.naturalHeight
    //     });
    //     console.log(imgInstance);

    //     // const imgInstance = new FabricImage(imgElement, {
    //     //     left: 100,
    //     //     top: 100,
    //     //     selectable: true,
    //     // });
    //     console.log(canvas);

    //     // imgInstance.setControlsVisibility()
    //     console.log(canvas.add(imgInstance))
    //     console.log(canvas.getObjects());

    //     console.log(canvas.renderAll());

    //     if (e)
    //         e.target.value = ""
    // };
    const handleKeyDown = (e) => {
        if (e.key === 'Delete') {
            const activeObject = canvas.getActiveObject();
            console.log(activeObject.type, activeObject);

            if (activeObject.type == "textbox" && activeObject.isEditing) return
            if (activeObject) {
                canvas.remove(activeObject);
                canvas.renderAll();
            }
        }
    };
    const setPropertyList = () => {
        const listOfProp = new Set([])
        // selectedObjs.current.forEach(obj => {
        const obj = canvas.getActiveObject()
        if (!obj) {
            setPropVisibilityList([])
            return;
        }
        console.log(obj.type)
        switch (obj.type) {
            case "textbox":
                listOfProp.add("fontSize")
                listOfProp.add("alignment")
                listOfProp.add("textStyles")
                listOfProp.add("textColor")
                listOfProp.add("backgroundColor")
                console.log(obj.getSelectionStyles(0, 5))
                setToolProperties({
                    textColor: obj.fill,
                    fontFamily: obj.fontFamily,
                    fontSize: obj.fontSize,
                    fontStyle: obj.fontStyle,//"oblique,italic"
                    fontWeight: obj.fontWeight,
                    // linethrough: false,
                    // overline: false,
                    // stroke: null,
                    // strokeWidth: 1,
                    textBackgroundColor: obj.textBackgroundColor,
                    underline: obj.underline,
                    textAlign: obj.textAlign//“left”, “center”, “right”, “justify”,


                    // fill: "#ff000080",
                    // fontFamily: "Times New Roman",
                    // fontSize: 20,
                    // fontStyle: "normal",oblique,italic
                    // fontWeight: "normal",
                    // linethrough: false,
                    // overline: false,
                    // stroke: null,
                    // strokeWidth: 1,
                    // textBackgroundColor: "",
                    // underline: false,
                    // textAlign: "left"//“left”, “center”, “right”, “justify”,
                })
                break;

            default:
                listOfProp.add("backgroundColor")
                break;
        }
        // })
        setPropVisibilityList([...listOfProp.values()])
    }

    const listEle = () => {
        const objects = canvas.getObjects()
        console.log(objects);

        console.log(objects.map((obj) => {
            return obj.type
        }));

        // function pasteText() {
        // if (navigator.clipboard) {
        //     navigator.clipboard.clone(function (clonedObj) {
        //         canvas.discardActiveObject();
        //         clonedObj.set({
        //             left: clonedObj.left + 10,
        //             top: clonedObj.top + 10,
        //             evented: true,
        //         });
        //         canvas.add(clonedObj);
        //         canvas.setActiveObject(clonedObj);
        //         canvas.requestRenderAll();
        //     });
        // }
        // }
    }


    const moveObject = (val) => {
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        if (val > 0)
            canvas.bringObjectForward(activeObject)
        else
            canvas.sendObjectToBack(activeObject)
        canvas.renderAll();
    }

    // introTxt = new Textbox('Paste images here', txtStyles),
    //     pasteImage = function (e) {
    //         var items = e.originalEvent.clipboardData.items;

    //         e.preventDefault();
    //         e.stopPropagation();

    //         //Loop through files
    //         for (var i = 0; i < items.length; i++) {
    //             if (items[i].type.indexOf('image') == -1) continue;
    //             var file = items[i],
    //                 type = items[i].type;
    //             var imageData = file.getAsFile();
    //             var URLobj = window.URL || window.webkitURL;
    //             var img = new Image();
    //             img.src = URLobj.createObjectURL(imageData);
    //             FabricImage.fromURL(img.src, function (img) {
    //                 canvas.add(img);
    //             });
    //         }
    //     }
    const getJsonData = () => {
        const json = JSON.stringify({ ...canvas.toJSON(), background: canvasBackgroundColor, canvasWidth, canvasHeight });
        return json
        // localStorage.setItem("canvasJSON", json)
    }
    const retrive = async (data) => {
        console.log(data);
        const json = JSON.parse(data || localStorage.getItem("canvasJSON") || "{}");
        await canvas.loadFromJSON(json);
        canvas.renderAll()
        chagneCanvasSetings(json?.canvasWidth || 1056, json?.canvasHeight || 816)


    }
    const chagneCanvasSetings = (width, height, bgcolor) => {
        // console.log(canvas);

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
            <div className='flex justify-center items-center'>
                <div className="tools shadow gap-2 p-3 w-min rounded-md max-h-min  my-2 mx-auto justify-center flex">
                    <button style={{ borderRadius: "8px", background: tool === "select" ? "#5555ff" : undefined }} onClick={() => setTool("select")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.27254 0.463265C4.08937 0.451781 3.90591 0.480776 3.73521 0.548189C3.5645 0.615602 3.41073 0.719779 3.28483 0.853319C3.15893 0.98686 3.06397 1.14649 3.00672 1.32086C2.94946 1.49524 2.93131 1.68008 2.95354 1.86226L4.84279 22.134C4.96354 23.1185 6.12704 23.5773 6.88679 22.9398L10.8735 19.7068L12.661 22.803C13.689 24.5835 15.32 25.021 17.1005 23.993C18.881 22.965 19.318 21.3335 18.29 19.553L16.5088 16.468L21.2328 14.657C22.1648 14.3178 22.3495 13.0805 21.5578 12.4838L4.94604 0.711765C4.7506 0.564815 4.5166 0.478416 4.27254 0.463265Z" fill={tool === "select" ? "white" : "black"} />
                    </svg>
                    </button>
                    <button style={{ borderRadius: "8px", background: tool === "rect" ? "#5555ff" : undefined }} onClick={() => setTool("rect")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.7917 4.16666H5.20837C4.37957 4.16666 3.58472 4.4959 2.99867 5.08195C2.41261 5.668 2.08337 6.46286 2.08337 7.29166V17.7083C2.08337 18.5371 2.41261 19.332 2.99867 19.918C3.58472 20.5041 4.37957 20.8333 5.20837 20.8333H19.7917C20.6205 20.8333 21.4154 20.5041 22.0014 19.918C22.5875 19.332 22.9167 18.5371 22.9167 17.7083V7.29166C22.9167 6.46286 22.5875 5.668 22.0014 5.08195C21.4154 4.4959 20.6205 4.16666 19.7917 4.16666Z" fill={tool === "rect" ? "white" : "black"} />
                    </svg>
                    </button>
                    <button style={{ borderRadius: "8px", background: tool === "elipse" ? "#5555ff" : undefined }} onClick={() => setTool("elipse")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 22.9167C11.0591 22.9167 9.7049 22.6431 8.43754 22.0958C7.17018 21.5486 6.06775 20.8066 5.13025 19.8698C4.19275 18.933 3.45074 17.8306 2.90421 16.5625C2.35768 15.2945 2.08407 13.9403 2.08338 12.5C2.08268 11.0597 2.35629 9.70557 2.90421 8.43751C3.45213 7.16945 4.19414 6.06702 5.13025 5.13022C6.06636 4.19341 7.16879 3.4514 8.43754 2.90418C9.70629 2.35695 11.0605 2.08334 12.5 2.08334C13.9396 2.08334 15.2938 2.35695 16.5625 2.90418C17.8313 3.4514 18.9337 4.19341 19.8698 5.13022C20.8059 6.06702 21.5483 7.16945 22.0969 8.43751C22.6455 9.70557 22.9188 11.0597 22.9167 12.5C22.9146 13.9403 22.641 15.2945 22.0959 16.5625C21.5507 17.8306 20.8087 18.933 19.8698 19.8698C18.9309 20.8066 17.8285 21.549 16.5625 22.0969C15.2966 22.6448 13.9424 22.9181 12.5 22.9167Z" fill={tool === "elipse" ? "white" : "black"} />
                    </svg>
                    </button>
                    <button style={{ borderRadius: "8px", background: tool === "text" ? "#5555ff" : undefined }} onClick={() => setTool("text")} className='shadow p-2'><svg width="30" height="30" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <label htmlFor='selectImage' onClick={() => setTool("img")} style={{ borderRadius: "8px", background: tool === "img" ? "#5555ff" : undefined }} className='shadow p-2'><svg width="30" height="30" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.375 39.375C8.34375 39.375 7.46125 39.0081 6.7275 38.2744C5.99375 37.5406 5.62625 36.6575 5.625 35.625V9.375C5.625 8.34375 5.9925 7.46125 6.7275 6.7275C7.4625 5.99375 8.345 5.62625 9.375 5.625H35.625C36.6563 5.625 37.5394 5.9925 38.2744 6.7275C39.0094 7.4625 39.3762 8.345 39.375 9.375V35.625C39.375 36.6563 39.0081 37.5394 38.2744 38.2744C37.5406 39.0094 36.6575 39.3762 35.625 39.375H9.375ZM11.25 31.875H33.75L26.7188 22.5L21.0938 30L16.875 24.375L11.25 31.875Z" fill={tool === "img" ? "white" : "black"} />
                    </svg>


                    </label>
                    <input type="file" id="selectImage" className='hidden' accept='image/jpeg, image/png' onChange={handleFileUploads} />
                    <select className='shadow p-2' onChange={(e) => {
                        const textBox = new Textbox(e.target.value, { fill: "#000000ff", top: 100, left: 100, fontSize: 20, fontFamily: "Roboto" })
                        canvas.add(textBox)
                        canvas.renderAll()
                    }}>
                        <option selected disabled hidden>Embeddings</option>
                        {listEmbeddings.map((val, i) => <option key={i} value={val.value}>{val.title}</option>)}
                    </select>
                    <button style={{ borderRadius: "8px", background: tool === "text" ? "#5555ff" : undefined }} onClick={() => {
                        const img = new Image()
                        // img.width=100
                        // img.height=100
                        img.src = "/qr.webp"
                        const imgObj = new FabricImage(img, {
                            top: 100, left: 100, //scaleX: .3, scaleY: .3,
                            // width:100,height:100,
                            lockScalingX: true,
                            lockScalingY: true,
                            lockRotation: true,
                            strokeLineCap: "qrcode",

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
                    }} className='shadow p-2 w-11'><img src={"/qr.webp"} className="" />
                    </button>
                </div>

            </div>
            <div className='m-auto w-full p-4 gap-10 flex justify-center'>
                <CanvasPaint ref={canvasEl} />
                <div className="tools shadow gap-2 p-4 w-min rounded  my-2 justify-center flex flex-row">
                    {/* <div style={{  background: "url(data:image/svg+xml;utf8,%3Csvg%20width%3D%222%22%20height%3D%222%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200h1v2h1V1H0%22%20fill-rule%3D%22nonzero%22%20fill%3D%22%23e1e1e1%22/%3E%3C/svg%3E)" }}>
                        <div></div>
                    </div> */}
                    <div className='flex flex-col gap-2 w-max'>
                        <div className='flex flex-col'>
                            <label htmlFor="">Fill Color</label>
                            <ColorDropdown currentColor={toolProperties.textColor} defaultColor={toolProperties.textColor} onChange={handleTextColorChange} />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="">Background Color</label>
                            <ColorDropdown currentColor={toolProperties.backgroundColor} defaultColor={toolProperties.backgroundColor} onChange={handleBackgroundColorChange} />
                        </div>
                        <div className="flex gap-1">
                            <div className='flex flex-col'>
                                <label htmlFor="">Size</label>
                                <input type="number" className='w-min text-center max-w-[4rem]' value={toolProperties.fontSize} onChange={(e) => {
                                    setToolProperties(p => ({ ...p, fontSize: Number(e.target.value) }))
                                }} />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className='flex flex-col'>
                                <label htmlFor="">Font</label>
                                <select onChange={(e) => {
                                    setToolProperties(p => ({ ...p, fontFamily: e.target.value }))
                                }} value={toolProperties.fontFamily}>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Roboto">Roboto</option>
                                </select>
                                {/* <input type="number" className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                            </div>

                        </div>
                        <div className="flex gap-1">
                            <div className='flex flex-col'>
                                <label htmlFor="">Align</label>
                                <select onChange={(e) => {
                                    setToolProperties(p => ({ ...p, textAlign: e.target.value }))
                                }} value={toolProperties.textAlign}>
                                    <option value="left">left</option>
                                    <option value="right">right</option>
                                    <option value="center">center</option>
                                    <option value="justify">justify</option>
                                </select>
                                {/* <input type="number" className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} /> */}
                            </div>

                        </div>
                        <div className="flex gap-1">
                            <div className='flex flex-col'>
                                <label htmlFor="">Width</label>
                                <input type="number" value={canvasWidth} className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(e.target.value)} defaultValue={canvas?.width} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="">Height</label>
                                <input type="number" value={canvasHeight} className='w-min text-center max-w-[4rem]' onChange={(e) => chagneCanvasSetings(null, e.target.value)} defaultValue={canvas?.height} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tools shadow gap-2 p-3 w-min  my-2 mx-auto justify-center flex">
                {/* <button style={{ borderRadius: "8px", background: tool === "select" ? "#5555ff" : undefined }} onClick={() => setTool("select")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.27254 0.463265C4.08937 0.451781 3.90591 0.480776 3.73521 0.548189C3.5645 0.615602 3.41073 0.719779 3.28483 0.853319C3.15893 0.98686 3.06397 1.14649 3.00672 1.32086C2.94946 1.49524 2.93131 1.68008 2.95354 1.86226L4.84279 22.134C4.96354 23.1185 6.12704 23.5773 6.88679 22.9398L10.8735 19.7068L12.661 22.803C13.689 24.5835 15.32 25.021 17.1005 23.993C18.881 22.965 19.318 21.3335 18.29 19.553L16.5088 16.468L21.2328 14.657C22.1648 14.3178 22.3495 13.0805 21.5578 12.4838L4.94604 0.711765C4.7506 0.564815 4.5166 0.478416 4.27254 0.463265Z" fill={tool === "select" ? "white" : "black"} />
                </svg>
                </button>
                <button style={{ borderRadius: "8px", background: tool === "rect" ? "#5555ff" : undefined }} onClick={() => setTool("rect")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.7917 4.16666H5.20837C4.37957 4.16666 3.58472 4.4959 2.99867 5.08195C2.41261 5.668 2.08337 6.46286 2.08337 7.29166V17.7083C2.08337 18.5371 2.41261 19.332 2.99867 19.918C3.58472 20.5041 4.37957 20.8333 5.20837 20.8333H19.7917C20.6205 20.8333 21.4154 20.5041 22.0014 19.918C22.5875 19.332 22.9167 18.5371 22.9167 17.7083V7.29166C22.9167 6.46286 22.5875 5.668 22.0014 5.08195C21.4154 4.4959 20.6205 4.16666 19.7917 4.16666Z" fill={tool === "rect" ? "white" : "black"} />
                </svg>
                </button>
                <button style={{ borderRadius: "8px", background: tool === "elipse" ? "#5555ff" : undefined }} onClick={() => setTool("elipse")} className='shadow p-2'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 22.9167C11.0591 22.9167 9.7049 22.6431 8.43754 22.0958C7.17018 21.5486 6.06775 20.8066 5.13025 19.8698C4.19275 18.933 3.45074 17.8306 2.90421 16.5625C2.35768 15.2945 2.08407 13.9403 2.08338 12.5C2.08268 11.0597 2.35629 9.70557 2.90421 8.43751C3.45213 7.16945 4.19414 6.06702 5.13025 5.13022C6.06636 4.19341 7.16879 3.4514 8.43754 2.90418C9.70629 2.35695 11.0605 2.08334 12.5 2.08334C13.9396 2.08334 15.2938 2.35695 16.5625 2.90418C17.8313 3.4514 18.9337 4.19341 19.8698 5.13022C20.8059 6.06702 21.5483 7.16945 22.0969 8.43751C22.6455 9.70557 22.9188 11.0597 22.9167 12.5C22.9146 13.9403 22.641 15.2945 22.0959 16.5625C21.5507 17.8306 20.8087 18.933 19.8698 19.8698C18.9309 20.8066 17.8285 21.549 16.5625 22.0969C15.2966 22.6448 13.9424 22.9181 12.5 22.9167Z" fill={tool === "elipse" ? "white" : "black"} />
                </svg>
                </button>
                <button style={{ borderRadius: "8px", background: tool === "text" ? "#5555ff" : undefined }} onClick={() => setTool("text")} className='shadow p-2'><svg width="30" height="30" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_41_41)">
                        <path fill={tool == "text" ? "white" : "black"} d="M9.375 6.5625C8.62908 6.5625 7.91371 6.85882 7.38626 7.38626C6.85882 7.91371 6.5625 8.62908 6.5625 9.375C6.5625 10.1209 6.85882 10.8363 7.38626 11.3637C7.91371 11.8912 8.62908 12.1875 9.375 12.1875H19.6875V37.5C19.6875 38.2459 19.9838 38.9613 20.5113 39.4887C21.0387 40.0162 21.7541 40.3125 22.5 40.3125C23.2459 40.3125 23.9613 40.0162 24.4887 39.4887C25.0162 38.9613 25.3125 38.2459 25.3125 37.5V12.1875H35.625C36.3709 12.1875 37.0863 11.8912 37.6137 11.3637C38.1412 10.8363 38.4375 10.1209 38.4375 9.375C38.4375 8.62908 38.1412 7.91371 37.6137 7.38626C37.0863 6.85882 36.3709 6.5625 35.625 6.5625H9.375Z" />
                    </g>
                    <defs>
                        <clipPath id="clip0_41_41">
                            <rect width="45" height="45" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                </button> */}
                {/* <input type="color" onChange={handleColorChange} /> */}
                <button onClick={() => moveObject(1)}>Up</button>
                <button onClick={() => moveObject(-1)}>Down</button>
                <button onClick={listEle}>list elements</button>
                {/* <button onClick={getJsonData}>Save</button> */}
                <button onClick={() => retrive()}>Retrive</button>
            </div>
        </div>
    );
};
export function ShowCanvas({ initialData, makeitimg = false, location = window.location.href }) {
    const [canvas, setCanvas] = useState();
    const canvasEl = useRef();
    const qrcodeRef = useRef()
    const json = JSON.parse(initialData || "{}");

    const retrive = async (data) => {
        // console.log(data);
        await canvas.loadFromJSON(json, function (o, object) {
            console.log(o, object, object.strokeLineCap);

            if (!object.strokeLineCap) return;
            if (object.strokeLineCap !== "qrcode") return;
            // console.log(object, object.height)

            const imgDataURL = qrcodeRef.current.toDataURL("image/png");
            const qrImage = new Image();
            qrImage.src = imgDataURL;
            // qrImage.width = object.width
            // qrImage.height = object.height
            qrImage.onload = () => {
                // const imgInstance = new fabric.FabricImage(qrImage, {
                //     left: object.left,
                //     top: object.top,
                //     selectable: false,
                //     width: object.width,
                //     height: object.height,
                //     minimumScaleTrigger: object.minimumScaleTrigger,
                //     // visible: false
                // });

                object.setElement(qrImage)//.add(imgInstance);
                // object.set
                // object.
                object.scaleToWidth(130)
                object.scaleToHeight(130)
                canvas.renderAll();
            };

            // object.set('selectable', false);



        });
        canvas.renderAll()
        canvas.setDimensions({ width: json.canvasWidth, height: json.canvasHeight })
        canvas.upperCanvasEl.style.pointerEvents = "none"
        if (makeitimg) {
            canvas.lowerCanvasEl.style.width = "100%"
            canvas.lowerCanvasEl.style.height = "auto"
            canvas.lowerCanvasEl.style.maxWidth = "1024px"
        }
        // canvas.upperCanvasEl.style.width = "100%"
        // canvas.upperCanvasEl.style.height = "auto"
        // canvas.upperCanvasEl.style.maxWidth = "1024px"
        // width: 100%; */
        // height: auto;
        // max-width: 1024px;


    }

    const finalImg = () => {

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1.0 // 0.0 to 1.0
        });

        // Create an image element
        const imgElement = document.createElement('img');
        imgElement.src = dataURL;
        document.body.innerHTML = ""
        document.body.appendChild(imgElement);
        window.downloadLink = dataURL
        // Create a download link
        // const btnElement = document.createElement('button');
        // btnElement.innerText="Download"
        // btnElement.style.marginLeft="auto"
        // btnElement.style.marginRight="auto"
        // btnElement.style.background="blue"
        // btnElement.style.color="blue"

        // document.body.appendChild(btnElement)

    }

    useEffect(() => {
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
        if (!canvas) return;
        retrive(initialData).then(() => {
            if (makeitimg)
                setTimeout(finalImg, 0)
        })

    }, [canvas, initialData])
    return <div className={""}><CanvasPaint ref={canvasEl} />
        <div style={{ display: "none" }}>
            <QRCodeCanvas
                value={location}
                size={100}
                imageSettings={{
                    src: "/cropped-fevIocn-192x192.png",
                    x: null, // Positioning of the logo (null for center)
                    y: null,
                    height: 20, // Height of the logo
                    width: 20, // Width of the logo
                    excavate: true,
                }}
                level={"H"}
                ref={qrcodeRef}
                includeMargin={false}
            />
        </div>
        {/* <button onClick={}>click</button> */}
    </div>
}
const CanvasPaint = forwardRef((props, ref) => {
    return <canvas ref={ref} style={{ border: '1px solid black' }} />

})
export default CanvasComponent;