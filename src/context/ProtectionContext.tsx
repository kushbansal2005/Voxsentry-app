import React, { createContext, useState, useContext } from 'react';

type ProtectionContextType = {
  isProtectionActive: boolean;
  setIsProtectionActive: (active: boolean) => void;
};

const ProtectionContext = createContext<ProtectionContextType | undefined>(undefined);

export function ProtectionProvider({ children }: { children: React.ReactNode }) {
  const [isProtectionActive, setIsProtectionActive] = useState(false);

  return (
    <ProtectionContext.Provider value={{ isProtectionActive, setIsProtectionActive }}>
      {children}
    </ProtectionContext.Provider>
  );
}

export function useProtection() {
  const context = useContext(ProtectionContext);
  if (context === undefined) {
    throw new Error('useProtection must be used within a ProtectionProvider');
  }
  return context;
}
