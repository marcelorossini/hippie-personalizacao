import { LayerTransform } from '../../types/layer';

export const calculatePosition = (
  event: MouseEvent | TouchEvent,
  element: HTMLElement
): { x: number; y: number } => {
  const rect = element.getBoundingClientRect();
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

export const getTransformOrigin = (transform: LayerTransform): { x: number; y: number } => {
  return {
    x: transform.x + transform.width / 2,
    y: transform.y + transform.height / 2,
  };
}; 