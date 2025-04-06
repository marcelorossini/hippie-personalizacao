import { useState } from 'react';
import { Layer } from '../types/layer';

export const useLayerManager = () => {
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

  const addLayer = (layer: Layer) => {
    setLayers(prev => [...prev, layer]);
  };

  const updateLayer = (updatedLayer: Layer) => {
    setLayers(prev => prev.map(layer => 
      layer.id === updatedLayer.id ? updatedLayer : layer
    ));
  };

  return {
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
    updateLayer,
  };
}; 