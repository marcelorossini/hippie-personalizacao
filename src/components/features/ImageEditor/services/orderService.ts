import { OrderData } from '../types/order';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4564';

export const sendOrderToApi = async (formData: FormData): Promise<any> => {
  const response = await fetch(`${apiBaseUrl}/api/tshirt/order`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar imagem: ${response.status}`);
  }

  return response.json();
}; 


export const createOrderFormData = (blob: Blob, orderData: OrderData): FormData => {
  const formData = new FormData();
  formData.append('file', blob, 'design.png');
  formData.append('userEmail', orderData.userEmail || '');
  formData.append('originId', orderData.originId || '');
  formData.append('orderId', orderData.orderId);
  formData.append('userId', orderData.userId || '');
  formData.append('size', orderData.size);
  formData.append('color', orderData.color);
  return formData;
};