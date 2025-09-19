import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchReportes, createReporteAPI, updateReporteAPI, deleteReporteAPI } from '../services/reportes';

export interface Reportes {
  id: number;
  programacion: number;
  usuario_nombre: string;
  ficha: {
    id: number;
    numero: string;
  };
  entrada_usuario: string;
  salida_usuario: string;
  estado: 'completo' | 'pendiente' | 'revisado';
  fecha_reporte: string;
}

// Para creación/edición
export interface ReportesInput {
  programacion: number;
  entrada_usuario: string;
  salida_usuario: string;
  estado: 'completo' | 'pendiente' | 'revisado';
}

interface ReporteContextType {
  reportes: Reportes[];
  createReporte: (data: ReportesInput) => void;
  updateReporte: (id: number, updateReporte: Partial<ReportesInput>) => void;
  deleteReporte: (id: number) => void;
  exportReportes: (reportesToExport: Reportes[]) => void;
}

const ReporteContext = createContext<ReporteContextType | undefined>(undefined);

export const ReporteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reportes, setReporte] = useState<Reportes[]>([]);

  useEffect(() => {
      const loadReportes = async () => {
          try {
              const data = await fetchReportes();
              setReporte(data);
          } catch (error) {
              console.error('Error cargando reportes:', error);
          }
      };

      loadReportes();
  }, []);

  const createReporte = async (data: ReportesInput) => {
      try {
          const newReporte = await createReporteAPI(data);
          setReporte(prev => [...prev, newReporte]);
      } catch (error: any) {
        if (error.response && error.response.data) {
          alert('Error: ' + JSON.stringify(error.response.data));
        } else {
          console.error('Error desconocido:', error);
        }
      }
  };

  const updateReporte = async (id: number, updated: Partial<ReportesInput>) => {
      await updateReporteAPI(id, updated);
      setReporte(prev => 
          prev.map(r => r.id === id ? { ...r, ...updated } : r)
      );
  };

  const deleteReporte = async (id: number) => {
      try {
          await deleteReporteAPI(id);
          setReporte(prev => prev.filter(u => u.id !== id));
      } catch (error) {
          console.error('Error eliminando reporte:', error);
      }
  };

  const exportReportes = (reportesToExport: Reportes[]) => {
    // Crear CSV
    const headers = [
      'No. Programación',
      'Funcionario',
      'Fecha',
      'Hora Entrada',
      'Hora Salida',
      'Estado'
    ];

    const csvContent = [
      headers.join(','),
      ...reportesToExport.map(report => [
        report.programacion,
        `"${report.usuario_nombre}"`,
        report.fecha_reporte,
        report.entrada_usuario,
        report.salida_usuario,
        report.estado
      ].join(','))
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reportes_senasec_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ReporteContext.Provider value={{
      reportes,
      createReporte,
      updateReporte,
      deleteReporte,
      exportReportes
    }}>
      {children}
    </ReporteContext.Provider>
  );
};

export const useReportes = (): ReporteContextType => {
  const context = useContext(ReporteContext);
  if (!context) {
    throw new Error('useReporte must be used within a ReporteProvider');
  }
  return context;
};
