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
    const img = (item as HTMLElement).querySelector('.design-image') as HTMLImageElement;
    if (!img) return;

    const imgWidth = img.offsetWidth;
    const imgHeight = img.offsetHeight;
    
    // Verifica se o aspect ratio está correto
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
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
    ctx.drawImage(img, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight);
    ctx.restore();
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