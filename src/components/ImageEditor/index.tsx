import React, { useState } from 'react';
import LayersPanel from './LayersPanel';
import DesignArea from './DesignArea';

export interface Layer {
  id: string;
  name: string;
  imgSrc: string;
}

const App: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const moveLayerForward = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx < 0 || idx === layers.length - 1) return;
    const newLayers = [...layers];
    const temp = newLayers[idx];
    newLayers[idx] = newLayers[idx + 1];
    newLayers[idx + 1] = temp;
    setLayers(newLayers);
  };

  const moveLayerBackward = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx <= 0) return;
    const newLayers = [...layers];
    const temp = newLayers[idx];
    newLayers[idx] = newLayers[idx - 1];
    newLayers[idx - 1] = temp;
    setLayers(newLayers);
  };

  const sendLayerToFront = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx < 0) return;
    const newLayers = [...layers];
    const [layerObj] = newLayers.splice(idx, 1);
    newLayers.push(layerObj);
    setLayers(newLayers);
  };

  const sendLayerToBack = () => {
    if (!selectedLayerId) return;
    const idx = layers.findIndex(l => l.id === selectedLayerId);
    if (idx < 0) return;
    const newLayers = [...layers];
    const [layerObj] = newLayers.splice(idx, 1);
    newLayers.unshift(layerObj);
    setLayers(newLayers);
  };

  const removeLayer = () => {
    if (!selectedLayerId) return;
    const newLayers = layers.filter(l => l.id !== selectedLayerId);
    setLayers(newLayers);
    setSelectedLayerId(null);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-5 p-5">
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
      <DesignArea
        layers={layers}
        setLayers={setLayers}
        selectedLayerId={selectedLayerId}
        setSelectedLayerId={setSelectedLayerId}
      />
    </div>
  );
};

export default App;
