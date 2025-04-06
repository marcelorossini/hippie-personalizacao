import { Layer as BaseLayer } from './layer';

// Re-exportar o tipo Layer diretamente do arquivo layer.ts
export type Layer = BaseLayer;

export interface LayerTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
}

export interface LayerWithTransform extends BaseLayer {
  transform: LayerTransform;
} 