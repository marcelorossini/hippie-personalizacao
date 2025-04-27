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
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold">Editar Texto</h3>

        {/* Prévia do texto - fixa no topo em dispositivos móveis */}
        <div className={`rounded-md bg-white ${isMobile ? 'sticky top-0 z-10' : ''}`}>
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

        {/* Conteúdo com scroll */}
        <div className={`${isMobile ? 'overflow-y-auto flex-1 mt-4' : 'space-y-4'}`}>
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
            <div className={`${isMobile
                ? 'flex overflow-x-auto pb-2 snap-x snap-mandatory gap-2'
                : 'grid grid-cols-3 gap-2'
              } max-h-60`}>
              {FONT_OPTIONS.map((font: FontOption) => (
                <button
                  key={font.value}
                  className={`p-2 rounded-md border transition-all flex-shrink-0 ${isMobile ? 'w-32 snap-center' : ''
                    } ${layer.fontFamily === font.value
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  onClick={() => handleFontFamilyChange(font.value)}
                >
                  <span
                    className="text-lg block truncate"
                    style={{
                      fontFamily: font.value,
                      color: layer.color || '#000000',
                    }}
                  >
                    {layer.text || 'Digite seu texto aqui'}
                  </span>
                </button>
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
      </div>
    </VaulDrawer>
  );
};

export default TextEditorDrawer; 