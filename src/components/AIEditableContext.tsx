import React, { createContext, useContext, useState } from 'react';

interface AIEditableContextType {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  showAIButton: boolean;
  setShowAIButton: (show: boolean) => void;
  showAIModal: boolean;
  setShowAIModal: (show: boolean) => void;
}

const AIEditableContext = createContext<AIEditableContextType>({
  activeId: null,
  setActiveId: () => {},
  showAIButton: false,
  setShowAIButton: () => {},
  showAIModal: false,
  setShowAIModal: () => {},
});

export const useAIEditableContext = () => useContext(AIEditableContext);

export const AIEditableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAIButton, setShowAIButton] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  return (
    <AIEditableContext.Provider value={{ activeId, setActiveId, showAIButton, setShowAIButton, showAIModal, setShowAIModal }}>
      {children}
    </AIEditableContext.Provider>
  );
}; 