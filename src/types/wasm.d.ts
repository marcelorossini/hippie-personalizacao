declare module '*.wasm?url' {
  const url: string;
  export default url;
}

declare module '@imagemagick/magick-wasm' {
  export interface MagickImage {
    width: number;
    height: number;
    resize(width: number, height: number): void;
    quality: number;
    write(format: MagickFormat): Uint8Array;
  }

  export enum MagickFormat {
    Jpeg = 'JPEG',
    Png = 'PNG',
    Gif = 'GIF',
  }

  export class ImageMagick {
    static read(data: Uint8Array, callback: (image: MagickImage) => void): void;
  }

  export function initializeImageMagick(wasmBytes?: Uint8Array): Promise<void>;
} 