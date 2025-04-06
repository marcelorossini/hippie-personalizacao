export const exportLayers = (designAreaRef: React.RefObject<HTMLDivElement | null>) => {
  if (!designAreaRef.current) return;

  // Define tamanho fixo do canvas em 4096x4096
  const canvasSize = 4096;
  const designWidth = designAreaRef.current.offsetWidth;
  const designHeight = designAreaRef.current.offsetHeight;

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Calcula os fatores de escala para que o design caiba no canvas mantendo a proporção
  const scaleX = canvasSize / designWidth;
  const scaleY = canvasSize / designHeight;
  const scale = Math.min(scaleX, scaleY);

  // Calcula deslocamentos para centralizar o design no canvas
  const offsetX = (canvasSize - designWidth * scale) / 2;
  const offsetY = (canvasSize - designHeight * scale) / 2;

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  const items = designAreaRef.current.getElementsByClassName('design-item');
  Array.from(items).forEach(item => {
    const left = parseFloat((item as HTMLElement).style.left) || 0;
    const top = parseFloat((item as HTMLElement).style.top) || 0;
    const angle = parseFloat((item as HTMLElement).dataset.rotateAngle || '0') || 0;
    
    // Verifica se é uma camada de texto ou imagem
    const textElement = (item as HTMLElement).querySelector('.design-text') as HTMLDivElement;
    const imgElement = (item as HTMLElement).querySelector('.design-image') as HTMLImageElement;
    
    if (textElement) {
      // É uma camada de texto
      const text = textElement.textContent || '';
      const fontSize = parseFloat(window.getComputedStyle(textElement).fontSize) || 24;
      const fontFamily = window.getComputedStyle(textElement).fontFamily;
      const color = window.getComputedStyle(textElement).color;
      
      const textWidth = textElement.offsetWidth;
      const textHeight = textElement.offsetHeight;
      
      const centerX = left + textWidth / 2;
      const centerY = top + textHeight / 2;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * Math.PI / 180);
      
      // Configura o estilo do texto
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Desenha o texto
      ctx.fillText(text, 0, 0);
      ctx.restore();
    } else if (imgElement) {
      // É uma camada de imagem
      const imgWidth = imgElement.offsetWidth;
      const imgHeight = imgElement.offsetHeight;
      
      // Verifica se o aspect ratio está correto
      const naturalWidth = imgElement.naturalWidth;
      const naturalHeight = imgElement.naturalHeight;
      const aspectRatio = naturalWidth / naturalHeight;
      
      // Se o aspect ratio estiver incorreto, corrige
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      
      if (Math.abs(imgWidth / imgHeight - aspectRatio) > 0.01) {
        finalHeight = imgWidth / aspectRatio;
      }
      
      const centerX = left + finalWidth / 2;
      const centerY = top + finalHeight / 2;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * Math.PI / 180);
      ctx.drawImage(imgElement, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight);
      ctx.restore();
    }
  });

  ctx.restore();

  const dataURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'design-highres.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}; 