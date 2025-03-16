import React, { useState } from 'react';
import LayersPanel from './LayersPanel';
import DesignArea from './DesignArea';

export interface Layer {
  id: string;
  name: string;
  container: HTMLDivElement;
}

const App: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-5 p-5">
      <LayersPanel
        layers={layers}
        selectedLayerId={selectedLayerId}
        onSelectLayer={(id) => setSelectedLayerId(id)}
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
