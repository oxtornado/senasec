import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchEquipment, updateEquipmentAPI } from '../services/equipments';

export interface Equipment {
  id: number;
  posicion: number; // Posición en el gráfico de ambientes (1-16)
  numero_serie: string;
  tipo: 'computador' | 'televisor';
  pulgadas: string;
  caracteristicas: string;
  estado: 'disponible' | 'mantenimiento' | 'dañado';
  ultima_actualizacion: string;

  ambiente: number;
  accessories?: {
    screen: boolean;
    keyboard: boolean;
    mouse: boolean;
  };
}

interface EquipmentContextType {
  equipment: Equipment[];
  updateEquipment: (id: number, updatedEquipment: Partial<Equipment>) => void;
  getEquipmentByPosition: (posicion: number) => Equipment | undefined;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await fetchEquipment();
        setEquipment(data);
      } catch (error) {
        console.error('Error cargando equipos:', error);
      }
    };

    loadEquipment();
  }, []);

  const updateEquipment = async (id: number, updated: Partial<Equipment>) => {
    await updateEquipmentAPI(id, updated);
    setEquipment(prev => 
      prev.map(eq => eq.id === id ? { ...eq, ...updated } : eq)
    );
  };

  const getEquipmentByPosition = (posicion: number): Equipment | undefined => {
    return equipment.find(eq => eq.posicion === posicion);
  };

  return (
    <EquipmentContext.Provider value={{
      equipment,
      updateEquipment,
      getEquipmentByPosition
    }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};
