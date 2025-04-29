import React, { useState, useEffect, useRef } from 'react';
import DesignArea from '../components/features/ImageEditor/components/DesignArea';
import ImageGallery from '../components/features/ImageGallery';
import VaulDrawer from '../components/common/ui/Drawer';
import { Layer } from '../components/features/ImageEditor/types/layer';
import { Dispatch, SetStateAction } from 'react';
import TextEditorDrawer from '../components/features/ImageEditor/components/TextEditorDrawer';
import ExportButton from '../components/features/ImageEditor/components/ExportButton';

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
    addLayer,
  } = layerManager;

  const [showTextDrawer, setShowTextDrawer] = useState(false);
  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);
  const designAreaRef = useRef<HTMLDivElement>(null);

  const handleImageSelect = (imageUrl: string) => {
    const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    addLayer({
      id: layerId,
      name: 'Camada ' + layerId,
      type: 'image',
      imgSrc: imageUrl,
    });
    onImageSelect?.(imageUrl);
  };

  const updateLayer = (updatedLayer: Layer) => {
    setLayers(prev => prev.map(layer =>
      layer.id === updatedLayer.id ? updatedLayer : layer
    ));
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex items-center justify-center">
        <DesignArea
          layers={layers}
          setLayers={setLayers}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
          designAreaRef={designAreaRef}
        />
      </div>
      {/* Galeria lateral visível apenas em desktop */}
      <div className="hidden md:flex w-80 border-l border-gray-200 px-4 flex-col h-full">
        <h3 className="text-lg font-semibold mb-4 text-[#5e160f]">Figurinhas da Hippie</h3>

        <div className="flex-1 overflow-auto">
          <ImageGallery onImageSelect={handleImageSelect} />
        </div>

        <div className="mt-4 border-t border-gray-200 bg-white">
          <ExportButton designAreaRef={designAreaRef} layers={layers} />
        </div>
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

      {/* Drawer de edição de texto */}
      {selectedLayer && (
        <TextEditorDrawer
          open={showTextDrawer}
          onOpenChange={setShowTextDrawer}
          layer={selectedLayer}
          onUpdate={updateLayer}
        />
      )}
    </div>
  );
};

export default ImageEditor;

