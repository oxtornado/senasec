import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAssignments, createAssignmentAPI, updateAssignmentAPI, deleteAssignmentAPI } from '../services/assignments';

export interface Assignments {
  id: number;
  usuario: {
    id: number;
    username: string;
  };
  ambiente: {
    id: number;
    nombre: string;
  };
  ficha: {
    id: number;
    numero: string;
  };
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

// Para creación/edición
export interface AssignmentsInput {
  usuario_id: number;
  ambiente_id: number;
  ficha_id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

interface AssignmentContextType {
  assignments: Assignments[];
  createAssignment: (data: AssignmentsInput) => void;
  updateAssignment: (id: number, updateAssignment: Partial<AssignmentsInput>) => void;
  deleteAssignment: (id: number) => void;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export const AssignmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [assignments, setAssignment] = useState<Assignments[]>([]);

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                const data = await fetchAssignments();
                setAssignment(data);
            } catch (error) {
                console.error('Error cargando programaciones:', error);
            }
        };

        loadAssignments();
    }, []);

    const createAssignment = async (data: AssignmentsInput) => {
        try {
            const newAssignment = await createAssignmentAPI(data);
            setAssignment(prev => [...prev, newAssignment]);
        } catch (error: any) {
          if (error.response && error.response.data) {
            alert('Error: ' + JSON.stringify(error.response.data));
          } else {
            console.error('Error desconocido:', error);
          }
        }
    };


    const updateAssignment = async (id: number, updated: Partial<AssignmentsInput>) => {
        await updateAssignmentAPI(id, updated);
        setAssignment(prev => 
            prev.map(a => a.id === id ? { ...a, ...updated } : a)
        );
    };

    const deleteAssignment = async (id: number) => {
        try {
            await deleteAssignmentAPI(id);
            setAssignment(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error eliminando programación:', error);
        }
    };

    return (
        <AssignmentContext.Provider value={{
            assignments,
            createAssignment,
            updateAssignment,
            deleteAssignment
        }}>
            {children}
        </AssignmentContext.Provider>
    );
}

export const useAssignments = () => {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
      throw new Error('useAssignment must be used within a AssignmentProvider');
  }
  return context;
};