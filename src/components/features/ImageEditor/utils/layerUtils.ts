import { Layer } from '../types';

export const createLayerItem = (imgSrc: string, layerCounterRef: React.MutableRefObject<number>): Layer => {
  const layerId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  return {
    id: layerId,
    name: 'Camada ' + layerCounterRef.current++,
    imgSrc,
  };
};

export const sendLayerToBack = (
  layers: Layer[],
  selectedLayerId: string | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
) => {
  if (!selectedLayerId) return;
  const idx = layers.findIndex(l => l.id === selectedLayerId);
  if (idx < 0) return;
  const newLayers = [...layers];
  const [layerObj] = newLayers.splice(idx, 1);
  newLayers.unshift(layerObj);
  setLayers(newLayers);
};

export const sendLayerToFront = (
  layers: Layer[],
  selectedLayerId: string | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
) => {
  if (!selectedLayerId) return;
  const idx = layers.findIndex(l => l.id === selectedLayerId);
  if (idx < 0) return;
  const newLayers = [...layers];
  const [layerObj] = newLayers.splice(idx, 1);
  newLayers.push(layerObj);
  setLayers(newLayers);
};

export const moveLayerForward = (
  layers: Layer[],
  selectedLayerId: string | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
) => {
  if (!selectedLayerId) return;
  const idx = layers.findIndex(l => l.id === selectedLayerId);
  if (idx < 0 || idx === layers.length - 1) return;
  const newLayers = [...layers];
  const temp = newLayers[idx];
  newLayers[idx] = newLayers[idx + 1];
  newLayers[idx + 1] = temp;
  setLayers(newLayers);
};

export const moveLayerBackward = (
  layers: Layer[],
  selectedLayerId: string | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
) => {
  if (!selectedLayerId) return;
  const idx = layers.findIndex(l => l.id === selectedLayerId);
  if (idx <= 0) return;
  const newLayers = [...layers];
  const temp = newLayers[idx];
  newLayers[idx] = newLayers[idx - 1];
  newLayers[idx - 1] = temp;
  setLayers(newLayers);
};

export const removeLayer = (
  selectedLayerId: string | null,
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>,
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!selectedLayerId) return;
  setLayers(prev => prev.filter(layer => layer.id !== selectedLayerId));
  setSelectedLayerId(null);
}; 