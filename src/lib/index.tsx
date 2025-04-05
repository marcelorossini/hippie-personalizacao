import React from 'react';
import LayersPanel from '../components/features/ImageEditor/components/LayersPanel';
import DesignArea from '../components/features/ImageEditor/components/DesignArea';
import { Layer } from '../components/features/ImageEditor/types/layer';
import { Dispatch, SetStateAction } from 'react';

interface LayerManager {
  layers: Layer[];
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  selectedLayerId: string | null;
  setSelectedLayerId: Dispatch<SetStateAction<string | null>>;
  moveLayerForward: () => void;
  moveLayerBackward: () => void;
  sendLayerToFront: () => void;
  sendLayerToBack: () => void;
  removeLayer: () => void;
  addLayer: (layer: Layer) => void;
}

interface ImageEditorProps {
  layerManager: LayerManager;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ layerManager }) => {
  const {
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    moveLayerForward,
    moveLayerBackward,
    sendLayerToFront,
    sendLayerToBack,
    removeLayer,
  } = layerManager;

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-5 p-5">
      <div className="flex flex-col gap-4">
        <LayersPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={(id) => setSelectedLayerId(id)}
          moveLayerForward={moveLayerForward}
          moveLayerBackward={moveLayerBackward}
          sendLayerToFront={sendLayerToFront}
          sendLayerToBack={sendLayerToBack}
          removeLayer={removeLayer}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <DesignArea
          layers={layers}
          setLayers={setLayers}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
        />
      </div>
    </div>
  );
};

export default ImageEditor;
