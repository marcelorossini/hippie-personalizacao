export interface Layer {
  id: string;
  name: string;
  imgSrc?: string;
  type: 'text' | 'image';
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  zIndex?: number;
} 