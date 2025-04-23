import React, { useState } from 'react';
import { exportLayers } from '../utils/exportUtils';
import { createOrderFormData, sendOrderToApi } from '../utils/apiUtils';
import { notifyParentFrame, messageParentFrame, executeJavascriptParentFrame, getUrlParams } from '../utils/orderUtils';
import LoadingSpinner from './LoadingSpinner';
import SizeSelector from './SizeSelector';
import ConfirmationModal from './ConfirmationModal';
import { Layer } from '../types/layer';

interface ExportButtonProps {
  designAreaRef: React.RefObject<HTMLDivElement | null>;
  layers: Layer[];
}

interface OrderData {
  userEmail?: string;
  checkoutId?: string;
  orderId: string;
  userId?: string;
  size: string;
  color: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ designAreaRef, layers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleExport = async () => {
    if (layers.length === 0) {
      messageParentFrame('Atenção', 'Adicione pelo menos uma imagem antes de colocar na mochila', true);
      return;
    }

    if (!selectedSize) {
      setShowError(true);
      messageParentFrame('Atenção', 'Selecione um tamanho antes de colocar na mochila', true);
      return;
    }
    
    try {
      setIsLoading(true);
      const blob = await exportLayers(designAreaRef);
      const urlParams = getUrlParams();
      
      const orderData: OrderData = {
        userEmail: urlParams.userEmail || undefined,
        checkoutId: urlParams.checkoutId || undefined,
        orderId: '12312123',
        userId: urlParams.userId || undefined,
        size: selectedSize,
        color: 'off-white'
      };

      const formData = createOrderFormData(blob, orderData);
      const result = await sendOrderToApi(formData);
      console.log('Imagem enviada com sucesso:', result);
      notifyParentFrame(urlParams.productVariantId);
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Erro ao exportar as camadas:', error);
      messageParentFrame('Erro', 'Ocorreu um erro ao processar sua solicitação', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setShowError(false);
  };

  const handleContinueCreating = () => {
    setShowConfirmation(false);
    executeJavascriptParentFrame('window.location.reload();');
  };

  const handleGoToCart = () => {
    setShowConfirmation(false);
    executeJavascriptParentFrame('window.location.href = "https://checkout.hippieartesanatos.com"');
  };

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div className="mt-4 p-4 flex flex-row gap-4 items-end justify-between">
        <SizeSelector 
          selectedSize={selectedSize} 
          onSizeChange={handleSizeChange}
          showError={showError}
        />
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="border-none bg-[#74a451] rounded-[5px] h-16 flex items-center justify-center w-56 px-5 font-bold uppercase cursor-pointer text-white text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'PROCESSANDO...' : 'COLOCAR NA MOCHILA'}
          </button>
        </div>
      </div>
      <ConfirmationModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="O que você deseja fazer agora?"
        buttons={[
          {
            label: "Continuar Criando",
            onClick: handleContinueCreating,
            variant: "primary"
          },
          {
            label: "Ir para o Carrinho",
            onClick: handleGoToCart,
            variant: "secondary"
          }
        ]}
      />
    </>
  );
};

export default ExportButton; 