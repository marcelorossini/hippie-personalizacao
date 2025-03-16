import { useEffect, useState } from 'react';
import { ImageMagick, MagickFormat, MagickImage, initializeImageMagick } from '@imagemagick/magick-wasm';

interface ImageProcessorProps {
  imageUrl: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: MagickFormat;
  onProcessed?: (processedImageUrl: string) => void;
}

export const ImageProcessor: React.FC<ImageProcessorProps> = ({
  imageUrl,
  width,
  height,
  quality = 80,
  format = MagickFormat.Jpeg,
  onProcessed
}) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Inicializa o ImageMagick
        await initializeImageMagick();

        // Carrega a imagem
        const response = await fetch(imageUrl);
        const imageData = await response.arrayBuffer();
        const uint8Array = new Uint8Array(imageData);

        // Processa a imagem
        ImageMagick.read(uint8Array, (image: MagickImage) => {
          if (width && height) {
            image.resize(width, height);
          }
          
          image.quality = quality;
          
          const processedData = image.write(format);
          const blob = new Blob([processedData], { type: `image/${format.toLowerCase()}` });
          const processedUrl = URL.createObjectURL(blob);
          
          setProcessedImage(processedUrl);
          onProcessed?.(processedUrl);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao processar imagem');
      } finally {
        setIsLoading(false);
      }
    };

    processImage();
  }, [imageUrl, width, height, quality, format, onProcessed]);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (isLoading) {
    return <div>Processando imagem...</div>;
  }

  return processedImage ? (
    <img src={processedImage} alt="Imagem processada" />
  ) : null;
}; 