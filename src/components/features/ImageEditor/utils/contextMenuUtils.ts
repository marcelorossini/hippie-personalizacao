export const showContextMenu = (contextMenuRef: React.RefObject<HTMLDivElement | null>, x: number, y: number) => {
  if (contextMenuRef.current) {
    contextMenuRef.current.style.left = x + 'px';
    contextMenuRef.current.style.top = y + 'px';
    contextMenuRef.current.style.display = 'block';
  }
};

export const hideContextMenu = (contextMenuRef: React.RefObject<HTMLDivElement | null>) => {
  if (contextMenuRef.current) {
    contextMenuRef.current.style.display = 'none';
  }
}; 