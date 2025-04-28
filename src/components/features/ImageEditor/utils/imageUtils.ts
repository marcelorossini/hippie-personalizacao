import heic2any from 'heic2any';

// Função para validar as dimensões da imagem
const validateImageDimensions = (file: File): Promise<{ isValid: boolean; width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid = img.width >= 800 && img.height >= 800;
      console.log('Dimensões da imagem:', { width: img.width, height: img.height });
      resolve({ isValid, width: img.width, height: img.height });
    };
    img.onerror = () => {
      console.error('Erro ao carregar imagem para validação');
      resolve({ isValid: false, width: 0, height: 0 });
    };
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    // Limpa o object URL após o carregamento
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const isValid = img.width >= 800 && img.height >= 800;
      console.log('Dimensões da imagem:', { width: img.width, height: img.height });
      resolve({ isValid, width: img.width, height: img.height });
    };
  });
};

// Função para converter arquivos HEIC para JPEG e retornar uma Data URL
export const convertHeicFile = async (file: File): Promise<string> => {
  try {
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });
    // Caso retorne um array de blobs, usamos o primeiro
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao converter HEIC:', error);
    throw error;
  }
};

// Função de upload adaptada para tratar arquivos HEIC separadamente
export const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<string | null> => {
  const file = event.target.files && event.target.files[0];
  if (!file) return null;

  try {
    // Valida as dimensões da imagem
    const { isValid, width, height } = await validateImageDimensions(file);
    console.log('Resultado da validação:', { isValid, width, height });
    
    if (!isValid) {
      alert(`Erro: A imagem deve ter dimensões mínimas de 800x800 pixels.\nDimensões atuais: ${width}x${height} pixels`);
      return null;
    }

    let dataUrl: string;

    // Verifica se o arquivo é HEIC, seja pelo type ou pela extensão
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        dataUrl = await convertHeicFile(file);
      } catch (error) {
        console.error('Erro na conversão do arquivo HEIC', error);
        return null;
      }
    } else {
      // Para outros tipos de arquivo, utiliza o FileReader normalmente
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    return dataUrl;
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    alert('Erro ao processar a imagem. Por favor, tente novamente.');
    return null;
  }
}; 