import React from 'react';
import { Layer } from './App';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ layers, selectedLayerId, onSelectLayer }) => {
  return (
    <div className="w-48 border border-gray-300 p-3 rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Camadas</h2>
      <ul>
        {[...layers]
          .map((layer) => (
            <li
              key={layer.id}
              className={`py-1 px-2 mb-1 border border-gray-200 cursor-pointer rounded 
              hover:bg-gray-100 ${layer.id === selectedLayerId ? 'bg-gray-200 border-gray-400' : ''}`}
              onClick={() => onSelectLayer(layer.id)}
            >
              {layer.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LayersPanel;
