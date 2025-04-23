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