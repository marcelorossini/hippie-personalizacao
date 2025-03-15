import React from 'react';
import { Layer } from './App';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ layers, selectedLayerId, onSelectLayer }) => {
  return (
    <div className="layers-panel">
      <h2>Camadas</h2>
      <ul>
        {[...layers].reverse().map((layer) => (
          <li
            key={layer.id}
            className={layer.id === selectedLayerId ? 'selected' : ''}
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
