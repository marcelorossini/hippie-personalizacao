import React, { useState } from 'react';
import LayersPanel from './LayersPanel';
import DesignArea from './DesignArea';

// Define a interface para as camadas
export interface Layer {
  id: string;
  name: string;
  container: HTMLDivElement;
}

const App: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  return (
    <div className="container">
      <LayersPanel
        layers={layers}
        selectedLayerId={selectedLayerId}
        onSelectLayer={(id: React.SetStateAction<string | null>) => setSelectedLayerId(id)}
      />
      <DesignArea
        layers={layers}
        setLayers={setLayers}
        selectedLayerId={selectedLayerId}
        setSelectedLayerId={setSelectedLayerId}
      />
    </div>
  );
};

export default App;
