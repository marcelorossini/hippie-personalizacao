export interface Layer {
  id: string;
  name: string;
  imgSrc?: string;
  text?: string;
  type: 'image' | 'text';
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

export interface LayerTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
}

export interface LayerWithTransform extends Layer {
  transform: LayerTransform;
} 