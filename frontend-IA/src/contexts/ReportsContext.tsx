import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchReportes, createReporteAPI, updateReporteAPI, deleteReporteAPI } from '../services/reportes';
import * as XLSX from 'xlsx';

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
  // Crear los datos para la hoja de Excel
  const data = reportesToExport.map(report => ({
    'No. Programación': report.programacion,
    'Usuario': report.usuario_nombre,
    'Fecha': report.fecha_reporte,
    'Hora Entrada': report.entrada_usuario,
    'Hora Salida': report.salida_usuario,
    'Estado': report.estado
  }));

  // Convertir las claves a mayúsculas
  const headers = ['No. Programación', 'Usuario', 'Fecha', 'Hora Entrada', 'Hora Salida', 'Estado'];

  // Crear un libro de trabajo y agregarle una hoja
  const ws = XLSX.utils.json_to_sheet(data, { header: headers });

  // Estilo para los encabezados de las columnas
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } }, // Texto en negrita y blanco
    fill: { fgColor: { rgb: '6DC234' } },          // Fondo azul
    alignment: { horizontal: 'center' },           // Centrado del texto
  };

  // Aplicar el estilo a los encabezados
  headers.forEach((header, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index }); // Primera fila, columna index
    if (!ws[cellAddress]) ws[cellAddress] = {}; // Asegurarse de que la celda existe
    ws[cellAddress].s = headerStyle; // Aplicar el estilo
    ws[cellAddress].v = header.toUpperCase(); // Convertir el texto a mayúsculas
  });

  // Crear el libro de trabajo
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reportes');

  // Ajustar el ancho de las columnas
  const wscols = [
    { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }
  ];
  ws['!cols'] = wscols;

  // Descargar el archivo
  XLSX.writeFile(wb, `reportes_senasec_${new Date().toISOString().split('T')[0]}.xlsx`);
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
