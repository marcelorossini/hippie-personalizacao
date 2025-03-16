import { LayerTransform } from '../../types/layer';

export const calculateRotation = (
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number
): number => {
  const angle = Math.atan2(pointY - centerY, pointX - centerX);
  return angle * (180 / Math.PI);
};

export const calculateScale = (
  transform: LayerTransform,
  deltaWidth: number,
  deltaHeight: number
): number => {
  const currentScale = transform.scale || 1;
  const widthScale = (transform.width + deltaWidth) / transform.width;
  const heightScale = (transform.height + deltaHeight) / transform.height;
  
  return currentScale * ((widthScale + heightScale) / 2);
};

export const applyTransform = (
  transform: LayerTransform,
  updates: Partial<LayerTransform>
): LayerTransform => {
  return {
    ...transform,
    ...updates,
  };
}; 