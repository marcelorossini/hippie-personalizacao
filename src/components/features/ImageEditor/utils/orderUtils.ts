import { OrderData } from '../types/order';

export const getUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    productVariantId: searchParams.get('product_variant_id'),
    checkoutId: searchParams.get('checkout_id'),
    userId: searchParams.get('user_id'),
    userEmail: searchParams.get('user_mail'),
    userCpf: searchParams.get('user_cpf'),
  };
};

export const createOrderFormData = (blob: Blob, orderData: OrderData): FormData => {
  const formData = new FormData();
  formData.append('file', blob, 'design.png');

  Object.entries(orderData).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });

  return formData;
};

export const notifyParentFrame = (productVariantId: string | null) => {
  if (window.top && productVariantId) {
    window.top.postMessage(`
      addToCartClick(${productVariantId})
    `, '*');
  }
};

export const messageParentFrame = (message: string, description: string, error?: boolean) => {
  if (window.top) {
    window.top.postMessage(`
      showOverlay("${message}", "${description}", ${error || false});
    `, '*');
  }
};

export const executeJavascriptParentFrame = (message: string) => {
  if (window.top) {
    window.top.postMessage(message, '*');
  }
};  