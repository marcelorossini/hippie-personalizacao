import React from 'react';
import DesignArea from '../components/features/ImageEditor/components/DesignArea';
import LayersPanel from '../components/features/ImageEditor/components/LayersPanel';
import ImageGallery from '../components/features/ImageGallery';
import VaulDrawer from '../components/common/ui/Drawer';
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
  onImageSelect?: (imageUrl: string) => void;
  showMobileGallery?: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  layerManager,
  onImageSelect,
  showMobileGallery = false
}) => {
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

  const handleImageSelect = (imageUrl: string) => {
    const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    setLayers((prev: Layer[]) => [...prev, {
      id: layerId,
      name: 'Camada ' + layerId,
      imgSrc: imageUrl,
    }]);
    onImageSelect?.(imageUrl);
  };

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
      {/* Galeria lateral visível apenas em desktop */}
      <div className="hidden md:block w-64 border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-[#5e160f]">Figurinhas da Hippie</h3>
        <ImageGallery onImageSelect={handleImageSelect} />
      </div>
      {/* Drawer para galeria em mobile */}
      <VaulDrawer 
        open={showMobileGallery} 
        onOpenChange={() => onImageSelect?.('')}
      >
        <div className="flex flex-col h-full">
          <div className="mb-4 pt-2">
            <h3 className="text-lg font-semibold">Galeria de Imagens</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ImageGallery onImageSelect={handleImageSelect} />
          </div>
        </div>
      </VaulDrawer>
    </div>
  );
};

export default ImageEditor;

