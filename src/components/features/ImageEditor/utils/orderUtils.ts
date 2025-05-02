import { OrderData } from '../types/order';

export const getUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    productVariantId: searchParams.get('product_variant_id'),
    originId: searchParams.get('origin_id'),
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

export const notifyParentFrame = (productVariantId: string | null, quantity: number = 1) => {
  if (window.top && productVariantId) {
    window.top.postMessage(`
      (async () => {
        try {
          let product = getAttributeProductAndQuantity(${productVariantId})
          product[0].quantity = ${quantity}
          const checkout = await addOrCreateCheckout(product)
          if (!checkout) {
            showOverlay("Ocorreu um erro!", "Erro ao adicionar produto ao carrinho.", !0);
            return;
          }
          await loadMiniCart()        
          carregaCamisetasPersonalizadasMinicart();
          
          // Envia mensagem de confirmação para todos os iframes
          const message = {
            type: 'notifyParentFrameComplete',
            source: 'hippie-personalizacao'
          };
          
          // Envia para todos os iframes
          Array.from(window.frames).forEach(frame => {
            try {
              frame.postMessage(message, '*');
            } catch (error) {
              console.error('Erro ao enviar mensagem para iframe:', error);
            }
          });
          
          // Envia também para o window.top para garantir
          window.top.postMessage(message, '*');
        } catch (error) {
          console.error('Erro ao processar pedido:', error);
          showOverlay("Ocorreu um erro!", "Erro ao processar seu pedido.", !0);
        }
      })();
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