export const updateDesignAreaSize = (
  templateImageRef: React.RefObject<HTMLImageElement | null>,
  designAreaRef: React.RefObject<HTMLDivElement | null>,
  setTemplateSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>
) => {
  if (templateImageRef.current && designAreaRef.current) {
    const templateImg = templateImageRef.current;
    const designArea = designAreaRef.current;
    
    // Obtém as dimensões do container pai
    const containerWidth = designArea.parentElement?.clientWidth || 0;
    const containerHeight = designArea.parentElement?.clientHeight || 0;
    
    // Calcula a proporção da imagem template
    const templateAspectRatio = templateImg.naturalWidth / templateImg.naturalHeight;
    
    // Calcula as dimensões máximas permitidas (80% do container)
    const maxWidth = containerWidth * 0.5;
    const maxHeight = containerHeight * 0.5;
    
    // Calcula as dimensões mantendo a proporção
    let newWidth = maxWidth;
    let newHeight = newWidth / templateAspectRatio;
    
    // Se a altura exceder o máximo, recalcula baseado na altura
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * templateAspectRatio;
    }
    
    // Garante que as dimensões não sejam menores que um valor mínimo
    const minWidth = 100;
    const minHeight = 100;
    
    if (newWidth < minWidth) {
      newWidth = minWidth;
      newHeight = newWidth / templateAspectRatio;
    }
    
    if (newHeight < minHeight) {
      newHeight = minHeight;
      newWidth = newHeight * templateAspectRatio;
    }
    
    newWidth = newWidth * 0.85;

    // Atualiza o tamanho da área de design
    designArea.style.width = `${newWidth}px`;
    designArea.style.height = `${newHeight}px`;
    
    // Atualiza o estado com as novas dimensões
    setTemplateSize({
      width: newWidth,
      height: newHeight
    });
  }
}; 