import React, { useState } from 'react';
import { exportLayers } from '../utils/exportUtils';
import { createOrderFormData, sendOrderToApi } from '../services/orderService';
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
  originId?: string;
  checkoutId?: string;
  userId?: string;
  size: string;
  color: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ designAreaRef, layers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const handleExport = async () => {
    if (layers.length === 0) {
      messageParentFrame('Atenção', 'Adicione pelo menos uma imagem antes de colocar na mochila', true);
      return;
    }
    
    setShowSizeModal(true);
  };

  const handleSizeConfirm = () => {
    if (!selectedSize) {
      setShowError(true);
      messageParentFrame('Atenção', 'Selecione um tamanho antes de colocar na mochila', true);
      return;
    }
    setShowSizeModal(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmExport = async () => {
    setShowConfirmDialog(false);
    try {
      setIsLoading(true);
      const blob = await exportLayers(designAreaRef);
      const urlParams = getUrlParams();
      
      if (!selectedSize) {
        messageParentFrame('Erro', 'Tamanho não selecionado', true);
        return;
      }

      const orderData: OrderData = {
        userEmail: urlParams.userEmail || undefined,
        checkoutId: urlParams.checkoutId || undefined,
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
      <div className="mt-4 flex flex-col lg:flex-row items-end justify-center lg:justify-between gap-4">
        <div className="flex justify-end w-full lg:w-fit hidden lg:hidden">
          <button
            onClick={handleExport}
            className="w-full text-nowrap border-none bg-[#74a451] rounded-[5px] h-16 flex items-center justify-center w-56 px-5 font-bold uppercase cursor-pointer text-white text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'PROCESSANDO...' : 'COLOCAR NA MOCHILA'}
          </button>
        </div>
      </div>

      <ConfirmationModal
        open={showSizeModal}
        onOpenChange={setShowSizeModal}
        title="Selecione o tamanho"
        buttons={[
          {
            label: "Confirmar",
            onClick: handleSizeConfirm,
            variant: "primary"
          },
          {
            label: "Cancelar",
            onClick: () => setShowSizeModal(false),
            variant: "secondary"
          }
        ]}
      >
        <div className="">
          <SizeSelector 
            selectedSize={selectedSize} 
            onSizeChange={handleSizeChange}
            showError={showError}
          />
        </div>
      </ConfirmationModal>

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

      <ConfirmationModal
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirmar ação"
        buttons={[
          {
            label: "SIM",
            onClick: handleConfirmExport,
            variant: "primary"
          },
          {
            label: "NÃO",
            onClick: () => setShowConfirmDialog(false),
            variant: "secondary"
          }
        ]}
      />
    </>
  );
};

export default ExportButton; 