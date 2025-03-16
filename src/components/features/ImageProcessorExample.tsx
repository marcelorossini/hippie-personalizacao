import { useEffect, useState } from 'react';
import { ImageMagick, MagickFormat, initializeImageMagick } from '@imagemagick/magick-wasm';

// Importa o arquivo WASM diretamente
import wasmUrl from '@imagemagick/magick-wasm/magick.wasm?url';

export const ImageProcessorExample = () => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Carrega o arquivo WASM com o tipo MIME correto
        const response = await fetch(wasmUrl);
        const wasmBinary = await response.arrayBuffer();
        
        // Inicializa o ImageMagick com o binário WASM
        await initializeImageMagick(new Uint8Array(wasmBinary));
        setIsInitialized(true);
      } catch (err) {
        console.error('Erro ao inicializar ImageMagick:', err);
        setError('Erro ao inicializar ImageMagick');
      }
    };

    init();
  }, []);

  const processImage = async (file: File) => {
    if (!isInitialized) {
      setError('ImageMagick ainda não foi inicializado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // @ts-ignore - Ignorando erros de tipagem
      ImageMagick.read(uint8Array, (image) => {
        try {
          // Redimensiona mantendo a proporção
          const aspectRatio = image.width / image.height;
          const targetWidth = 800;
          const targetHeight = Math.round(targetWidth / aspectRatio);
          
          image.resize(targetWidth, targetHeight);
          image.quality = 80;
          
          // Converte para JPEG
          // @ts-ignore - Ignorando erros de tipagem
          const processedData = image.write(MagickFormat.Jpeg);
          const blob = new Blob([processedData], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          
          setProcessedImageUrl(url);
        } catch (err) {
          console.error('Erro ao processar imagem:', err);
          setError('Erro ao processar imagem');
        }
      });
    } catch (err) {
      console.error('Erro ao ler arquivo:', err);
      setError('Erro ao ler arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Processador de Imagens</h2>
      
      {!isInitialized && !error && (
        <p className="text-yellow-500">Inicializando ImageMagick...</p>
      )}

      {isInitialized && (
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="mt-1 text-sm text-gray-500">
            Selecione uma imagem para processar (JPG, PNG, GIF, etc.)
          </p>
        </div>
      )}

      {isLoading && (
        <div className="text-blue-600">
          <p>Processando imagem...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500">
          <p>Erro: {error}</p>
        </div>
      )}
      
      {processedImageUrl && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Imagem Processada:</h3>
          <img 
            src={processedImageUrl} 
            alt="Imagem processada" 
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}; 