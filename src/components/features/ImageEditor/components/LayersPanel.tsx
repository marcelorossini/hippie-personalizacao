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

    </div>
  );
};

export default LayersPanel;
