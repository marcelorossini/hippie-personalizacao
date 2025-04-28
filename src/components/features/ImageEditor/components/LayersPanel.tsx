import React, { useEffect, useState } from 'react';
import { Layer } from '../types/layer';
import TextLayer from './TextLayer';
import TextEditorDrawer from './TextEditorDrawer';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  moveLayerForward: () => void;
  moveLayerBackward: () => void;
  sendLayerToFront: () => void;
  sendLayerToBack: () => void;
  removeLayer: () => void;
  addLayer: (layer: Layer) => void;
  updateLayer: (layer: Layer) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  moveLayerForward,
  moveLayerBackward,
  sendLayerToFront,
  sendLayerToBack,
  removeLayer,
  addLayer,
  updateLayer
}) => {
  const [showTextOptions, setShowTextOptions] = useState(false);
  const [showTextDrawer, setShowTextDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Verifica se está em um dispositivo móvel
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

  const handleAddText = () => {
    const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    addLayer({
      id: layerId,
      name: 'Texto ' + layerId,
      type: 'text',
      text: 'Digite seu texto aqui',
      fontSize: 24,
      fontFamily: 'Roboto',
      color: '#000000'
    });
    setShowTextOptions(true);
  };

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  return (
    <>
      <div className="w-64 border border-gray-300 p-3 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Camadas</h3>
          <button
            onClick={handleAddText}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            + Texto
          </button>
        </div>

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

      {/* Drawer de edição de texto */}
      {selectedLayer && (
        <TextEditorDrawer
          open={showTextDrawer}
          onOpenChange={setShowTextDrawer}
          layer={selectedLayer}
          onUpdate={updateLayer}
        />
      )}
    </>
  );
};

export default LayersPanel;
