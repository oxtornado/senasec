import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Equipment {
  id: number;
  position: number; // Posición en el gráfico de ambientes (1-16)
  brand: string;
  model: string;
  serialNumber: string;
  status: 'Disponible' | 'En Uso' | 'Mantenimiento' | 'Dañado';
  type: 'computador' | 'televisor' | 'videobeam' | 'sonido';
  characteristics: string;
  lastUpdate: string;
  accessories?: {
    screen: boolean;
    keyboard: boolean;
    mouse: boolean;
  };
}

interface EquipmentContextType {
  equipment: Equipment[];
  updateEquipment: (id: number, updatedEquipment: Partial<Equipment>) => void;
  getEquipmentByPosition: (position: number) => Equipment | undefined;
  deleteEquipment: (id: number) => void;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

// Datos iniciales de equipos (sincronizados con Ambientes)
const initialEquipment: Equipment[] = [
  {
    id: 1,
    position: 1,
    brand: 'HP',
    model: 'EliteDesk 800 G6',
    serialNumber: 'HP001SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i5, 8GB RAM, 256GB SSD',
    lastUpdate: '2024-01-15',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 2,
    position: 2,
    brand: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'DL002SYS',
    status: 'En Uso',
    type: 'computador',
    characteristics: 'Intel Core i7, 16GB RAM, 512GB SSD',
    lastUpdate: '2024-01-14',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 3,
    position: 3,
    brand: 'Lenovo',
    model: 'ThinkCentre M720q',
    serialNumber: 'LV003SYS',
    status: 'Mantenimiento',
    type: 'computador',
    characteristics: 'Intel Core i3, 4GB RAM, 128GB SSD',
    lastUpdate: '2024-01-13',
    accessories: { screen: true, keyboard: false, mouse: true }
  },
  {
    id: 4,
    position: 4,
    brand: 'Asus',
    model: 'VivoMini UN68U',
    serialNumber: 'AS004SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i5, 8GB RAM, 256GB SSD',
    lastUpdate: '2024-01-12',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 5,
    position: 5,
    brand: 'HP',
    model: 'ProDesk 400 G7',
    serialNumber: 'HP005SYS',
    status: 'Dañado',
    type: 'computador',
    characteristics: 'Intel Core i3, 4GB RAM, 500GB HDD',
    lastUpdate: '2024-01-11',
    accessories: { screen: true, keyboard: true, mouse: false }
  },
  {
    id: 6,
    position: 6,
    brand: 'Dell',
    model: 'Inspiron 3471',
    serialNumber: 'DL006SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i5, 8GB RAM, 1TB HDD',
    lastUpdate: '2024-01-10',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 7,
    position: 7,
    brand: 'Lenovo',
    model: 'IdeaCentre 3 07ADA',
    serialNumber: 'LV007SYS',
    status: 'En Uso',
    type: 'computador',
    characteristics: 'AMD Ryzen 5, 8GB RAM, 256GB SSD',
    lastUpdate: '2024-01-09',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 8,
    position: 8,
    brand: 'Asus',
    model: 'M32CD-K-SP001T',
    serialNumber: 'AS008SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i3, 4GB RAM, 1TB HDD',
    lastUpdate: '2024-01-08',
    accessories: { screen: false, keyboard: true, mouse: true }
  },
  {
    id: 9,
    position: 9,
    brand: 'HP',
    model: 'Pavilion Desktop',
    serialNumber: 'HP009SYS',
    status: 'Mantenimiento',
    type: 'computador',
    characteristics: 'Intel Core i5, 8GB RAM, 256GB SSD',
    lastUpdate: '2024-01-07',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 10,
    position: 10,
    brand: 'Dell',
    model: 'Vostro 3681',
    serialNumber: 'DL010SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i3, 4GB RAM, 1TB HDD',
    lastUpdate: '2024-01-06',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 11,
    position: 11,
    brand: 'Lenovo',
    model: 'ThinkCentre M75q',
    serialNumber: 'LV011SYS',
    status: 'En Uso',
    type: 'computador',
    characteristics: 'AMD Ryzen 3, 8GB RAM, 256GB SSD',
    lastUpdate: '2024-01-05',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 12,
    position: 12,
    brand: 'Asus',
    model: 'ExpertCenter D500MA',
    serialNumber: 'AS012SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i5, 8GB RAM, 512GB SSD',
    lastUpdate: '2024-01-04',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 13,
    position: 13,
    brand: 'HP',
    model: 'EliteDesk 705 G5',
    serialNumber: 'HP013SYS',
    status: 'Dañado',
    type: 'computador',
    characteristics: 'AMD Ryzen 5, 8GB RAM, 256GB SSD',
    lastUpdate: '2024-01-03',
    accessories: { screen: true, keyboard: false, mouse: true }
  },
  {
    id: 14,
    position: 14,
    brand: 'Dell',
    model: 'OptiPlex 3080',
    serialNumber: 'DL014SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i5, 8GB RAM, 256GB SSD',
    lastUpdate: '2024-01-02',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 15,
    position: 15,
    brand: 'Lenovo',
    model: 'IdeaCentre 5 14IMB',
    serialNumber: 'LV015SYS',
    status: 'En Uso',
    type: 'computador',
    characteristics: 'Intel Core i7, 16GB RAM, 512GB SSD',
    lastUpdate: '2024-01-01',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 16,
    position: 16,
    brand: 'Asus',
    model: 'VivoPC VM65N',
    serialNumber: 'AS016SYS',
    status: 'Disponible',
    type: 'computador',
    characteristics: 'Intel Core i3, 4GB RAM, 128GB SSD',
    lastUpdate: '2023-12-31',
    accessories: { screen: true, keyboard: true, mouse: true }
  },
  {
    id: 17,
    position: 0, // TV no tiene posición específica en el grid
    brand: 'Samsung',
    model: 'Smart TV 55" 4K',
    serialNumber: 'SM017TV',
    status: 'Disponible',
    type: 'televisor',
    characteristics: '55 pulgadas, 4K UHD, Smart TV, HDR',
    lastUpdate: '2024-01-16',
  }
];

export const EquipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('senasec-equipment');
    return saved ? JSON.parse(saved) : initialEquipment;
  });

  useEffect(() => {
    localStorage.setItem('senasec-equipment', JSON.stringify(equipment));
  }, [equipment]);

  const updateEquipment = (id: number, updatedEquipment: Partial<Equipment>) => {
    setEquipment(prev => prev.map(eq => 
      eq.id === id 
        ? { ...eq, ...updatedEquipment, lastUpdate: new Date().toISOString().split('T')[0] }
        : eq
    ));
  };

  const getEquipmentByPosition = (position: number): Equipment | undefined => {
    return equipment.find(eq => eq.position === position);
  };

  const deleteEquipment = (id: number) => {
    setEquipment(prev => prev.filter(eq => eq.id !== id));
  };

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const id = Math.max(...equipment.map(eq => eq.id)) + 1;
    setEquipment(prev => [...prev, { ...newEquipment, id, lastUpdate: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <EquipmentContext.Provider value={{
      equipment,
      updateEquipment,
      getEquipmentByPosition,
      deleteEquipment,
      addEquipment
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
