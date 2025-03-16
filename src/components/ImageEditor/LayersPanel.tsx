import React, { useEffect } from 'react';
import { Layer } from './DesignArea';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  moveLayerForward: () => void;
  moveLayerBackward: () => void;
  sendLayerToFront: () => void;
  sendLayerToBack: () => void;
  removeLayer: () => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  moveLayerForward,
  moveLayerBackward,
  sendLayerToFront,
  sendLayerToBack,
  removeLayer
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLayerId) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case ']':
            e.preventDefault();
            moveLayerForward();
            break;
          case '[':
            e.preventDefault();
            moveLayerBackward();
            break;
          case '}':
            e.preventDefault();
            sendLayerToFront();
            break;
          case '{':
            e.preventDefault();
            sendLayerToBack();
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            removeLayer();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, moveLayerForward, moveLayerBackward, sendLayerToFront, sendLayerToBack, removeLayer]);

  return (
    <div className="w-48 border border-gray-300 p-3 rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Camadas</h2>
      <ul>
        {[...layers]
          .map((layer) => (
            <li
              key={layer.id}
              className={`relative py-1 px-2 mb-1 border border-gray-200 cursor-pointer rounded 
              hover:bg-gray-100 ${layer.id === selectedLayerId ? 'bg-gray-200 border-gray-400' : ''}`}
              onClick={() => onSelectLayer(layer.id)}
            >
              <div className="flex items-center justify-between">
                <span>{layer.name}</span>
                {layer.id === selectedLayerId && (
                  <div className="flex gap-1">
                    <button
                      className="p-1 text-xs hover:bg-gray-200 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendLayerToFront();
                      }}
                      title="Enviar para frente (Ctrl + })"
                    >
                      ⇱
                    </button>
                    <button
                      className="p-1 text-xs hover:bg-gray-200 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendLayerToBack();
                      }}
                      title="Enviar para trás (Ctrl + {)"
                    >
                      ⇲
                    </button>
                    <button
                      className="p-1 text-xs hover:bg-gray-200 rounded text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer();
                      }}
                      title="Remover camada (Ctrl + Delete)"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LayersPanel;
