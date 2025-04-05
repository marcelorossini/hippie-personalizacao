import React, { useEffect } from 'react';
import { Layer } from '../types';

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
      <h3 className="text-lg font-semibold mb-3">Camadas</h3>
      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`p-2 rounded cursor-pointer flex items-center justify-between ${
              selectedLayerId === layer.id
                ? 'bg-blue-100 border border-blue-300'
                : 'hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <span className="text-sm truncate">{layer.name}</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayerBackward();
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Mover para trás"
              >
                ↓
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayerForward();
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Mover para frente"
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeLayer();
                }}
                className="p-1 hover:bg-red-100 text-red-600 rounded"
                title="Remover camada"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayersPanel;
