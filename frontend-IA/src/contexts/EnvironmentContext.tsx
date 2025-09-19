import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define lo que contiene un ambiente
export interface Ambiente {
  id: number;
  nombre: string;
  descripcion?: string;
}

// Define el tipo del contexto
interface AmbienteContextType {
  ambiente: Ambiente | null;
  setAmbiente: (ambiente: Ambiente) => void;
}

// Crea el contexto
const AmbienteContext = createContext<AmbienteContextType | undefined>(undefined);

// Proveedor del contexto
export const AmbienteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ambiente, setAmbiente] = useState<Ambiente | null>(null);

  return (
    <AmbienteContext.Provider value={{ ambiente, setAmbiente }}>
      {children}
    </AmbienteContext.Provider>
  );
};

// Hook para usar el contexto
export const useAmbiente = () => {
  const context = useContext(AmbienteContext);
  if (context === undefined) {
    throw new Error('useAmbiente debe usarse dentro de un AmbienteProvider');
  }
  return context;
};
