export const notifyParentFrame = (productVariantId?: string) => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: 'ORDER_COMPLETED',
        productVariantId,
      },
      '*'
    );
  }
}; 