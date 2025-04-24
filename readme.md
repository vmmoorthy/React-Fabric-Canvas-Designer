# React Fabric JS Sketch Wrapper

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
npm install react-fabric-js-sketch-wrapper
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { useReactFabricCanvas } from 'react-fabric-js-sketch-wrapper';

const App = () => {
  const { UIComponent, reactFabricStore } = useReactFabricCanvas({
    canvasWidth: 800,
    canvasHeight: 600,
    backgroundColor: '#ffffff',
    fontList: [
      { name: 'Arial', weights: [400, 700], styles: ['normal', 'italic'] },
    ],
  });

  return (
    <div>
      <h1>Fabric Canvas</h1>
      {UIComponent}
      <button onClick={() => console.log(reactFabricStore?.exportJSON())}>
        Export JSON
      </button>
    </div>
  );
};

export default App;
```

### Google Fonts Integration

Use the `useGoogleFontsLoader` hook to dynamically load Google Fonts:

```tsx
import React from 'react';
import { useGoogleFontsLoader } from 'react-fabric-js-sketch-wrapper';

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

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

Developed by [Your Name/Organization].
