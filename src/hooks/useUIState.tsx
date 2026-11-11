import React, { createContext, useContext, useState } from 'react';

type UIContextType = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <UIContext.Provider value={{ mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIState = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUIState must be used within UIProvider');
  return ctx;
};
