import React, { useEffect, useState } from 'react';
import { Layer } from '../types/layer';
import VaulDrawer from '../../../common/ui/Drawer';
import { FONT_OPTIONS, FontOption } from '../constants/fonts';

interface TextEditorDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layer: Layer;
  onUpdate: (layer: Layer) => void;
}

const TextEditorDrawer: React.FC<TextEditorDrawerProps> = ({
  open,
  onOpenChange,
  layer,
  onUpdate,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleTextChange = (text: string) => {
    onUpdate({ ...layer, text });
  };

  const handleFontSizeChange = (fontSize: number) => {
    onUpdate({ ...layer, fontSize });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    onUpdate({ ...layer, fontFamily });
  };

  const handleColorChange = (color: string) => {
    onUpdate({ ...layer, color });
  };

  return (
    <VaulDrawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Editar Texto</h3>
        
        {/* Prévia do texto */}
        <div className="p-4 border border-gray-300 rounded-md bg-white">
          <p className="text-sm font-medium text-gray-700 mb-2">Prévia:</p>
          <div 
            className="p-3 border border-gray-200 rounded bg-white"
            style={{
              fontSize: `${layer.fontSize || 24}px`,
              fontFamily: layer.fontFamily || 'Roboto',
              color: layer.color || '#000000',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {layer.text || 'Digite seu texto aqui'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texto
          </label>
          <textarea
            value={layer.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tamanho da Fonte
          </label>
          <input
            type="range"
            min="8"
            max="72"
            value={layer.fontSize || 24}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500 text-right">
            {layer.fontSize || 24}px
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fonte
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
            {FONT_OPTIONS.map((font: FontOption) => (
              <div 
                key={font.value}
                className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                  layer.fontFamily === font.value ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleFontFamilyChange(font.value)}
              >
                <span 
                  className="text-lg" 
                  style={{ 
                    fontFamily: font.value,
                    fontSize: `${layer.fontSize || 24}px`,
                    color: layer.color || '#000000',
                  }}
                >
                  {layer.text || 'Digite seu texto aqui'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor
          </label>
          <input
            type="color"
            value={layer.color || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-10 p-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </VaulDrawer>
  );
};

export default TextEditorDrawer; 