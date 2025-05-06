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
  quantity: number;
}

interface SizeQuantity {
  size: string;
  quantity: number;
}

const ExportButton: React.FC<ExportButtonProps> = ({ designAreaRef, layers }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showError, setShowError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([]);
  const [showAddMore, setShowAddMore] = useState(false);

  const resetState = () => {
    setSelectedSize(null);
    setQuantity(1);
    setShowError(false);
    setShowConfirmation(false);
    setShowConfirmDialog(false);
    setShowSizeModal(false);
    setShowAddMore(false);
    setSizeQuantities([]);
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  };

  const handleExport = async () => {
    if (layers.length === 0) {
      messageParentFrame('Atenção', 'Adicione pelo menos uma imagem antes de colocar na mochila', true);
      return;
    }
    
    try {
      setIsGeneratingPreview(true);
      const blob = await exportLayers(designAreaRef);
      const previewUrl = URL.createObjectURL(blob);
      setPreviewImage(previewUrl);
      setShowConfirmDialog(true);
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleConfirmDesign = () => {
    setShowConfirmDialog(false);
    setShowSizeModal(true);
  };

  const handleSizeConfirm = () => {
    if (!selectedSize) {
      setShowError(true);
      messageParentFrame('Atenção', 'Selecione um tamanho antes de colocar na mochila', true);
      return;
    }

    // Verifica se o tamanho já existe
    const existingSizeIndex = sizeQuantities.findIndex(item => item.size === selectedSize);
    
    if (existingSizeIndex !== -1) {
      // Se o tamanho já existe, soma a quantidade
      const updatedQuantities = [...sizeQuantities];
      updatedQuantities[existingSizeIndex].quantity += quantity;
      setSizeQuantities(updatedQuantities);
    } else {
      // Se o tamanho não existe, adiciona novo item
      const newSizeQuantity: SizeQuantity = {
        size: selectedSize,
        quantity: quantity
      };
      setSizeQuantities([...sizeQuantities, newSizeQuantity]);
    }

    setShowSizeModal(false);
    setShowAddMore(true);
  };

  const handleAddMore = () => {
    setShowAddMore(false);
    setSelectedSize(null);
    setQuantity(1);
    setShowSizeModal(true);
  };

  const handleFinish = async () => {
    setShowAddMore(false);
    try {
      setIsLoading(true);
      const blob = await exportLayers(designAreaRef);
      const urlParams = getUrlParams();

      // Envia cada combinação de tamanho e quantidade
      for (const item of sizeQuantities) {
        const orderData: OrderData = {
          userEmail: urlParams.userEmail || undefined,
          checkoutId: urlParams.checkoutId || undefined,
          userId: urlParams.userId || undefined,
          size: item.size,
          color: 'off-white',
          quantity: item.quantity
        };

        const formData = createOrderFormData(blob, orderData);
        await sendOrderToApi(formData);
      }

      console.log('Imagens enviadas com sucesso');
      const totalQuantity = sizeQuantities.reduce((sum, item) => sum + item.quantity, 0);
      
      // Aguarda a confirmação do frame pai
      await new Promise<void>((resolve) => {
        const messageHandler = (event: MessageEvent) => {
          if (
            event.data?.type === 'notifyParentFrameComplete' && 
            event.data?.source === 'hippie-personalizacao'
          ) {
            window.removeEventListener('message', messageHandler);
            resolve();
          }
        };
        window.addEventListener('message', messageHandler);
        notifyParentFrame(urlParams.productVariantId, totalQuantity);
      });

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

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleContinueCreating = () => {
    resetState();
    executeJavascriptParentFrame('window.location.reload();');
  };

  const handleGoToCart = () => {
    resetState();
    executeJavascriptParentFrame('window.location.href = "https://checkout.hippieartesanatos.com"');
  };

  const handleRemoveSize = (indexToRemove: number) => {
    setSizeQuantities(sizeQuantities.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <LoadingSpinner 
        isLoading={isLoading || isGeneratingPreview} 
        message={isGeneratingPreview ? 'Gerando preview...' : 'Adicionando na mochila'} 
      />
      <div className="flex flex-col lg:flex-row items-end justify-center lg:justify-between gap-4 p-2">
        <div className="flex justify-end w-full">
          <button
            onClick={handleExport}
            className="w-full text-nowrap border-none bg-[#74a451] h-16 flex items-center justify-center w-56 px-5 font-bold uppercase cursor-pointer text-white text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'PROCESSANDO...' : 'COLOCAR NA MOCHILA'}
          </button>
        </div>
      </div>

      <ConfirmationModal
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirma a estampa da camiseta?"
        buttons={[
          {
            label: "SIM",
            onClick: handleConfirmDesign,
            variant: "primary"
          },
          {
            label: "NÃO",
            onClick: () => setShowConfirmDialog(false),
            variant: "secondary"
          }
        ]}
      >
        <div className="text-center text-gray-600 mb-4">
          Atenção: depois de confirmado, não tem mais volta! <br/>Capriche na imagem porque não rola editar depois. 🖼️🚫
        </div>
        {previewImage && (
          <div className="flex justify-center mb-4">
            <img 
              src={previewImage} 
              alt="Preview do design" 
              className="max-w-full h-auto rounded-lg"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
        <small className="text-gray-500 text-center w-full">* Algumas cores podem ter leves divergências em relação ao produto real, pois cada dispositivo possui calibração de tela diferente.</small>
      </ConfirmationModal>

      <ConfirmationModal
        open={showSizeModal}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSizeQuantities([]);
            setSelectedSize(null);
            setQuantity(1);
          }
          setShowSizeModal(isOpen);
        }}        
        title="Selecione o tamanho e quantidade"
        buttons={[
          {
            label: "CONTINUAR",
            onClick: handleSizeConfirm,
            variant: "primary"
          },
          {
            label: "CANCELAR",
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
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        open={showAddMore}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSizeQuantities([]);
            setSelectedSize(null);
            setQuantity(1);
          }
          setShowAddMore(isOpen);
        }}
        title="Deseja adicionar mais tamanhos?"
        buttons={[
          {
            label: "ADICIONAR",
            onClick: handleAddMore,
            variant: "primary",
          },
          {
            label: "COLOCAR NA MOCHILA",
            onClick: handleFinish,
            variant: "secondary",
            disabled: sizeQuantities.length === 0            
          }
        ]}
      >
        <div className="text-center text-gray-600 mb-4">
          {sizeQuantities.length === 0 ? (
            <p className="text-red-500">Adicione pelo menos um tamanho antes de continuar.</p>
          ) : (
            <>
              Você já adicionou {sizeQuantities.length} {sizeQuantities.length === 1 ? 'tamanho' : 'tamanhos'} ao seu pedido.
              <br/>
              Deseja adicionar mais algum tamanho?
            </>
          )}
        </div>
        {sizeQuantities.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tamanhos adicionados:</h3>
            <ul className="space-y-2">
              {sizeQuantities.map((item, index) => (
                <li key={index} className="flex items-center justify-between text-sm text-gray-600 p-2 bg-gray-50 rounded-md">
                  <span>
                    {item.quantity}x Tamanho {item.size}
                  </span>
                  <button
                    onClick={() => handleRemoveSize(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Remover tamanho"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ConfirmationModal>

      <ConfirmationModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="O que você deseja fazer agora?"
        buttons={[
          {
            label: "CRIAR NOVA ESTAMPA",
            onClick: handleContinueCreating,
            variant: "primary"
          },
          {
            label: "IR PARA O CARRINHO",
            onClick: handleGoToCart,
            variant: "secondary"
          }
        ]}
      />
    </>
  );
};

export default ExportButton; 