# React Fabric Canvas Designer

A React-based wrapper for Fabric.js to create interactive and customizable canvas-based designs. This library provides tools for drawing, editing, and managing objects on a canvas with React-friendly APIs.

## Features

- **Drawing Tools**: Rectangle, Ellipse, Text, and Selection tools.
- **Object Manipulation**: Resize, rotate, align, and layer objects.
- **Customizable Properties**: Modify object properties like color, size, font, and more.
- **Google Fonts Integration**: Load and use Google Fonts dynamically.
- **JSON Import/Export**: Save and load canvas states as JSON.
- **React Components**: Prebuilt React components for user-friendly input controls.

## Installation

Install the package via npm:

```bash
npm install react-fabric-canvas-designer
```

## Usage

### Basic Example

```tsx
import { observer, useGoogleFontsLoader, useReactFabricCanvas } from 'react-fabric-canvas-designer';

const App = observer(() => {
  const { fonts, loading } = useGoogleFontsLoader("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Fredoka:wght@300..700&family=Inconsolata:wght@200..900&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap")
  const { UIComponent, reactFabricStore } = useReactFabricCanvas({ backgroundColor: "white", canvasHeight: 500, canvasWidth: 1000, fontList: fonts })
  if (loading || !reactFabricStore)
    return <h1>Loading...</h1>
  return <div className="grid grid-cols-12 grid-rows-12 gap-2 bg-gray-400 h-screen w-full">

    <div className="row-span-7 col-start-1 row-start-3">
      <div className='grid grid-cols-2 justify-items-center '>
        {reactFabricStore.availableTools.positionTools.map((tool, i) => {
          return <span key={i}>
            {tool.UIComponent}
          </span>
        })}
      </div>
      <div className='grid grid-cols-2 mt-5  justify-items-center '>
        {reactFabricStore.availableTools.alignmentTools.map((tool, i) => {
          return <span key={i}>
            {tool.UIComponent}
          </span>
        })}
      </div>
    </div>

    <div className="overflow-auto justify-self-center self-center col-span-9 row-span-9 col-start-2 row-start-2">
      {UIComponent}
    </div>

    <div className="col-span-2 row-span-12 col-start-11 row-start-1 overflow-y-scroll">
      {reactFabricStore.availableProperties.map((property, i) => {
        return <div key={i} className='justify-self-center'>
          <label className='text-xl font-semibold'>{property.name}</label>
          {property.UIComponent}
        </div>
      })}
    </div>

    <div className="col-span-7 col-start-3 row-start-11 flex justify-around">
      {reactFabricStore.availableTools.creationTools.map((tool, i) => {
        return <span key={i}>
          {tool.UIComponent}
        </span>
      })}
    </div>
  </div>

})


export default App
```

Note: Component should be wrapped using ```observer```, otherwise the value might not update as expected

### Google Fonts Integration

Use the `useGoogleFontsLoader` hook to dynamically load Google Fonts:

```tsx
import React from 'react';
import { useGoogleFontsLoader } from 'react-fabric-canvas-designer';

const App = () => {
  const { fonts, loading } = useGoogleFontsLoader(
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
  );

  if (loading) return <p>Loading fonts...</p>;

  return (
    <div>
      <h1>Available Fonts</h1>
      <ul>
        {fonts.map((font) => (
          <li key={font.name}>{font.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```

## API Reference

### `useReactFabricCanvas`

#### Props

| Prop             | Type          | Default   | Description                              |
|------------------|---------------|-----------|------------------------------------------|
| `canvasWidth`    | `number`      | `300`     | Width of the canvas in pixels.           |
| `canvasHeight`   | `number`      | `200`     | Height of the canvas in pixels.          |
| `backgroundColor`| `string`      | `#ffffff` | Background color of the canvas.          |
| `fontList`       | `FontInfo[]`  | `[]`      | List of fonts to be used in the canvas.  |

#### Returns

| Key                | Type                | Description                              |
|--------------------|---------------------|------------------------------------------|
| `UIComponent`      | `React.ReactNode`  | The canvas component to render.          |
| `reactFabricStore` | `ReactFabricStore` | Store instance for managing the canvas.  |

### `useGoogleFontsLoader`

#### Props

| Prop      | Type     | Description                              |
|-----------|----------|------------------------------------------|
| `cssUrl`  | `string` | URL to the Google Fonts CSS file.        |

#### Returns

| Key       | Type          | Description                              |
|-----------|---------------|------------------------------------------|
| `fonts`   | `FontInfo[]`  | List of loaded fonts.                    |
| `loading` | `boolean`     | Indicates if fonts are still loading.    |

## Input Components

The library provides prebuilt React components for user-friendly input controls:

- `InputText`: Text input.
- `InputNumber`: Number input with increment/decrement buttons.
- `InputRange`: Range slider.
- `InputColor`: Color picker.
- `InputSelect`: Dropdown select.

## Development

### Scripts

- `npm run build`: Build the library for production.
- `npm run dev`: Start the development server with live reloading.
- `npm run build:css`: Build Tailwind CSS.
- `npm run dev:css`: Watch and build Tailwind CSS.
- `npm test`: To test the library.

### Testing

This package uses Jest and React Testing Library for unit testing. To run tests:

```bash
npm run test
```

### Folder Structure

```
src/
├── Hooks/               # Custom React hooks
├── Objects/             # Fabric.js object wrappers
├── UserFirendlyInput/   # Input components
├── types/               # TypeScript type definitions
├── helpers/             # Utility functions
└── index.tsx            # Entry point
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Developed by VMMOORTHY.
