import React, { useRef, useEffect, useState } from 'react';
import DesignItem from './DesignItem';
import ExportButton from './ExportButton';
import { Layer } from '../types';
import { handleFileUpload } from '../utils/imageUtils';
import { createLayerItem, sendLayerToBack, sendLayerToFront, removeLayer } from '../utils/layerUtils';
import { updateDesignAreaSize } from '../utils/sizeUtils';
import TextEditorDrawer from './TextEditorDrawer';

interface DesignAreaProps {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  selectedLayerId: string | null;
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>;
  designAreaRef?: React.RefObject<HTMLDivElement | null>;
}

const DesignArea: React.FC<DesignAreaProps> = ({ layers, setLayers, selectedLayerId, setSelectedLayerId, designAreaRef: externalDesignAreaRef }) => {
  const internalDesignAreaRef = useRef<HTMLDivElement>(null);
  const designAreaRef = externalDesignAreaRef || internalDesignAreaRef;
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const layerCounterRef = useRef<number>(1);
  const templateImageRef = useRef<HTMLImageElement>(null);
  const [templateSize, setTemplateSize] = useState({ width: 0, height: 0 });
  const [showTextDrawer, setShowTextDrawer] = useState(false);

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const dataUrl = await handleFileUpload(event);
    if (dataUrl) {
      const newLayer = createLayerItem(dataUrl, layerCounterRef);
      setLayers(prev => [...prev, newLayer]);
    }
  };

  const selectLayer = (layerId: string) => {
    setSelectedLayerId(layerId);
  };



  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateDesignAreaSize(templateImageRef, designAreaRef, setTemplateSize);
    });

    if (templateImageRef.current) {
      resizeObserver.observe(templateImageRef.current);
    }

    window.addEventListener('resize', () => {
      updateDesignAreaSize(templateImageRef, designAreaRef, setTemplateSize);
    });

    updateDesignAreaSize(templateImageRef, designAreaRef, setTemplateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', () => {
        updateDesignAreaSize(templateImageRef, designAreaRef, setTemplateSize);
      });
    };
  }, []);

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundImage: 'url("./template-background.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="wrapper-customizada">
        <div className="flex-1 relative overflow-hidden flex items-center justify-center w-[150%] lg:w-full left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0">
          <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            <img
              draggable={false}
              ref={templateImageRef}
              src="./template-tshirt.webp"
              alt="Modelo de Camiseta"
              className="max-h-full max-w-full object-contain"
            />
            <div
              id="design-area"
              ref={designAreaRef}
              className="design-area absolute overflow-hidden select-none"
              style={{
                width: `${templateSize.width}px`,
                height: `${templateSize.height}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedLayerId(null);
                }
              }}
            >
              {layers.map(layer => (
                <DesignItem
                  key={layer.id}
                  id={layer.id}
                  layer={layer}
                  designAreaRef={designAreaRef}
                  isSelected={selectedLayerId === layer.id}
                  selectLayer={selectLayer}
                  sendLayerToBack={() => sendLayerToBack(layers, selectedLayerId, setLayers)}
                  sendLayerToFront={() => sendLayerToFront(layers, selectedLayerId, setLayers)}
                  removeLayer={() => removeLayer(selectedLayerId, setLayers, setSelectedLayerId)}
                  onEditText={() => {
                    if (layer.type === 'text') {
                      setSelectedLayerId(layer.id);
                      setShowTextDrawer(true);
                    }
                  }}
                />
              ))}
            </div>
          </div>
          <div
            id="context-menu"
            ref={contextMenuRef}
            className="absolute bg-white border border-gray-300 hidden z-50"
          >
            <ul className="py-1">
              <li onClick={() => sendLayerToFront(layers, selectedLayerId, setLayers)} className="py-1 px-3 cursor-pointer hover:bg-gray-100">
                Enviar para frente
              </li>
              <li onClick={() => sendLayerToBack(layers, selectedLayerId, setLayers)} className="py-1 px-3 cursor-pointer hover:bg-gray-100">
                Enviar para trás
              </li>
              <li onClick={() => removeLayer(selectedLayerId, setLayers, setSelectedLayerId)} className="py-1 px-3 cursor-pointer hover:bg-gray-100 text-red-600">
                Remover camada
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:hidden fixed left-0 bottom-0 z-50 bg-white shadow-lg p-4">
          <ExportButton designAreaRef={designAreaRef} layers={layers} />
        </div>

        {/* Drawer de edição de texto */}
        {selectedLayer && selectedLayer.type === 'text' && (
          <TextEditorDrawer
            open={showTextDrawer}
            onOpenChange={setShowTextDrawer}
            layer={selectedLayer}
            onUpdate={(updatedLayer) => {
              setLayers(prevLayers =>
                prevLayers.map(layer =>
                  layer.id === updatedLayer.id ? updatedLayer : layer
                )
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DesignArea;
