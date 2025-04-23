interface OrderData {
  userEmail?: string;
  checkoutId?: string;
  orderId: string;
  userId?: string;
  size: string;
  color: string;
}

export const createOrderFormData = (blob: Blob, orderData: OrderData): FormData => {
  const formData = new FormData();
  formData.append('image', blob, 'design.png');
  formData.append('orderData', JSON.stringify(orderData));
  return formData;
};

export const sendOrderToApi = async (formData: FormData): Promise<any> => {
  // TODO: Implementar a chamada real à API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}; 