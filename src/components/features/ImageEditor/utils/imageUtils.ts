import heic2any from 'heic2any';

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
}; 