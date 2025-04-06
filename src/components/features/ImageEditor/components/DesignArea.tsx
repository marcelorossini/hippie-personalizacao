import React, { useRef, useEffect, useState } from 'react';
import DesignItem from './DesignItem';
import ExportButton from './ExportButton';
import { Layer } from '../types';
import { handleFileUpload } from '../utils/imageUtils';
import { createLayerItem, sendLayerToBack, sendLayerToFront, removeLayer } from '../utils/layerUtils';
import { showContextMenu, hideContextMenu } from '../utils/contextMenuUtils';
import { updateDesignAreaSize } from '../utils/sizeUtils';

interface DesignAreaProps {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  selectedLayerId: string | null;
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>;
}

const DesignArea: React.FC<DesignAreaProps> = ({ layers, setLayers, selectedLayerId, setSelectedLayerId }) => {
  const designAreaRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const layerCounterRef = useRef<number>(1);
  const templateImageRef = useRef<HTMLImageElement>(null);
  const [templateSize, setTemplateSize] = useState({ width: 0, height: 0 });

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
    const handleGlobalClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        hideContextMenu(contextMenuRef);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('scroll', () => hideContextMenu(contextMenuRef));
    window.addEventListener('resize', () => hideContextMenu(contextMenuRef));
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('scroll', () => hideContextMenu(contextMenuRef));
      window.removeEventListener('resize', () => hideContextMenu(contextMenuRef));
    };
  }, []);

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
          <img
            draggable={false}
            ref={templateImageRef}
            src="./template.webp"
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
                showContextMenu={(x, y) => showContextMenu(contextMenuRef, x, y)}
                sendLayerToBack={() => sendLayerToBack(layers, selectedLayerId, setLayers)}
                sendLayerToFront={() => sendLayerToFront(layers, selectedLayerId, setLayers)}
                removeLayer={() => removeLayer(selectedLayerId, setLayers, setSelectedLayerId)}
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
      <ExportButton designAreaRef={designAreaRef} />
    </div>
  );
};

export default DesignArea;
