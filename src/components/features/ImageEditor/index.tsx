import React, { useState } from 'react';
import LayersPanel from './components/LayersPanel';
import DesignArea from './components/DesignArea';
import VaulDrawer from '../../common/ui/Drawer';
import { useLayerManager } from './hooks/useLayerManager';

export interface Layer {
  id: string;
  name: string;
  imgSrc: string;
}

const ImageEditor: React.FC = () => {
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
  } = useLayerManager();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-5 p-5">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Abrir Opções
        </button>
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
      <DesignArea
        layers={layers}
        setLayers={setLayers}
        selectedLayerId={selectedLayerId}
        setSelectedLayerId={setSelectedLayerId}
      />

      <VaulDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Opções de Edição</h2>
          <div className="space-y-2">
            <p>Aqui você pode adicionar mais opções de edição...</p>
          </div>
        </div>
      </VaulDrawer>
    </div>
  );
};

export default ImageEditor;
