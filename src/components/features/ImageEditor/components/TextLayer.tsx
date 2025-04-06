import React, { useState, useEffect } from 'react';
import { Layer } from '../types/layer';

interface TextLayerProps {
  layer: Layer;
  onUpdate: (updatedLayer: Layer) => void;
}

// Lista de fontes do Google Fonts
const fontOptions = [
  { value: 'Roboto', label: 'Roboto', preview: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat', preview: 'Montserrat' },
  { value: 'Open Sans', label: 'Open Sans', preview: 'Open Sans' },
  { value: 'Lato', label: 'Lato', preview: 'Lato' },
  { value: 'Poppins', label: 'Poppins', preview: 'Poppins' },
  { value: 'Raleway', label: 'Raleway', preview: 'Raleway' },
  { value: 'Oswald', label: 'Oswald', preview: 'Oswald' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', preview: 'Source Sans Pro' },
  { value: 'Ubuntu', label: 'Ubuntu', preview: 'Ubuntu' },
  { value: 'Playfair Display', label: 'Playfair Display', preview: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather', preview: 'Merriweather' },
  { value: 'PT Sans', label: 'PT Sans', preview: 'PT Sans' },
  { value: 'Nunito', label: 'Nunito', preview: 'Nunito' },
  { value: 'Quicksand', label: 'Quicksand', preview: 'Quicksand' },
  { value: 'Dancing Script', label: 'Dancing Script', preview: 'Dancing Script' },
  { value: 'Pacifico', label: 'Pacifico', preview: 'Pacifico' },
  { value: 'Comfortaa', label: 'Comfortaa', preview: 'Comfortaa' },
  { value: 'Josefin Sans', label: 'Josefin Sans', preview: 'Josefin Sans' },
  { value: 'Bebas Neue', label: 'Bebas Neue', preview: 'Bebas Neue' },
  { value: 'Righteous', label: 'Righteous', preview: 'Righteous' },
];

const TextLayer: React.FC<TextLayerProps> = ({ layer, onUpdate }) => {
  const [text, setText] = useState(layer.text || '');
  const [fontSize, setFontSize] = useState(layer.fontSize || 24);
  const [color, setColor] = useState(layer.color || '#000000');
  const [fontFamily, setFontFamily] = useState(layer.fontFamily || 'Roboto');

  // Carregar as fontes do Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontOptions.map(f => f.value.replace(' ', '+')).join('&family=')}&display=swap`;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({
      ...layer,
      text: newText,
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    onUpdate({
      ...layer,
      fontSize: newSize,
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onUpdate({
      ...layer,
      color: newColor,
    });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = e.target.value;
    setFontFamily(newFont);
    onUpdate({
      ...layer,
      fontFamily: newFont,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texto
        </label>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Digite seu texto aqui"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tamanho da Fonte
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            value={fontSize}
            onChange={handleFontSizeChange}
            min="8"
            max="72"
            className="flex-1"
          />
          <span className="text-sm font-medium">{fontSize}px</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cor
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="h-10 w-10 p-1 border border-gray-300 rounded-md"
          />
          <span className="text-sm font-medium">{color}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fonte
        </label>
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
          {fontOptions.map((font) => (
            <div 
              key={font.value}
              className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                fontFamily === font.value ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => {
                setFontFamily(font.value);
                onUpdate({
                  ...layer,
                  fontFamily: font.value,
                });
              }}
            >
              <span 
                className="text-lg" 
                style={{ fontFamily: font.value }}
              >
                {font.preview}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 border border-gray-300 rounded-md bg-gray-50">
        <p className="text-sm font-medium text-gray-700 mb-2">Prévia:</p>
        <div 
          className="p-3 border border-gray-200 rounded bg-white"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            color: color,
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {text || 'Digite seu texto aqui'}
        </div>
      </div>
    </div>
  );
};

export default TextLayer; 