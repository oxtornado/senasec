import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Report {
  id: number;
  programmingNumber: number;
  date: string;
  entryTime: string;
  exitTime: string;
  officialName: string;
  officialId: number;
  environmentId: number;
  environmentName: string;
  status: 'Completo' | 'Pendiente' | 'Revisado';
  observations?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'programmingNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (id: number, updatedReport: Partial<Report>) => void;
  deleteReport: (id: number) => void;
  getReportById: (id: number) => Report | undefined;
  getReportsByOfficial: (officialName: string) => Report[];
  getReportsByDateRange: (startDate: string, endDate: string) => Report[];
  exportReports: (reports: Report[]) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Datos iniciales de reportes (simulados)
const initialReports: Report[] = [
  {
    id: 1,
    programmingNumber: 1,
    date: '2024-01-15',
    entryTime: '08:00',
    exitTime: '16:00',
    officialName: 'Carlos Mendoza',
    officialId: 1,
    environmentId: 1,
    environmentName: 'Laboratorio de Sistemas',
    status: 'Completo',
    observations: 'Turno normal, sin novedades',
    createdBy: 'Carlos Mendoza',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z'
  },
  {
    id: 2,
    programmingNumber: 2,
    date: '2024-01-15',
    entryTime: '16:00',
    exitTime: '00:00',
    officialName: 'Ana García',
    officialId: 2,
    environmentId: 2,
    environmentName: 'Biblioteca',
    status: 'Completo',
    observations: 'Turno vespertino, revisión de seguridad completada',
    createdBy: 'Ana García',
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: 3,
    programmingNumber: 3,
    date: '2024-01-16',
    entryTime: '00:00',
    exitTime: '08:00',
    officialName: 'Miguel Torres',
    officialId: 3,
    environmentId: 3,
    environmentName: 'Auditorio Principal',
    status: 'Revisado',
    observations: 'Turno nocturno, ronda de seguridad cada 2 horas',
    createdBy: 'Miguel Torres',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z'
  },
  {
    id: 4,
    programmingNumber: 4,
    date: '2024-01-16',
    entryTime: '08:00',
    exitTime: '14:00',
    officialName: 'Laura Rodríguez',
    officialId: 4,
    environmentId: 4,
    environmentName: 'Cafetería',
    status: 'Pendiente',
    observations: 'Pendiente revisión de inventario',
    createdBy: 'Laura Rodríguez',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z'
  },
  {
    id: 5,
    programmingNumber: 5,
    date: '2024-01-16',
    entryTime: '14:00',
    exitTime: '22:00',
    officialName: 'Roberto Silva',
    officialId: 5,
    environmentId: 5,
    environmentName: 'Gimnasio',
    status: 'Completo',
    observations: 'Supervisión de actividades deportivas',
    createdBy: 'Roberto Silva',
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T22:00:00Z'
  }
];

export const ReportsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(initialReports);

  // Cargar reportes del localStorage al inicializar
  useEffect(() => {
    const savedReports = localStorage.getItem('senasec-reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (error) {
        console.error('Error loading reports from localStorage:', error);
      }
    }
  }, []);

  // Guardar reportes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('senasec-reports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (reportData: Omit<Report, 'id' | 'programmingNumber' | 'createdAt' | 'updatedAt'>) => {
    const newId = Math.max(...reports.map(r => r.id), 0) + 1;
    const newProgrammingNumber = Math.max(...reports.map(r => r.programmingNumber), 0) + 1;
    const now = new Date().toISOString();

    const newReport: Report = {
      ...reportData,
      id: newId,
      programmingNumber: newProgrammingNumber,
      createdAt: now,
      updatedAt: now
    };

    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (id: number, updatedReport: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { ...report, ...updatedReport, updatedAt: new Date().toISOString() }
        : report
    ));
  };

  const deleteReport = (id: number) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const getReportById = (id: number): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  const getReportsByOfficial = (officialName: string): Report[] => {
    return reports.filter(report => 
      report.officialName.toLowerCase().includes(officialName.toLowerCase())
    );
  };

  const getReportsByDateRange = (startDate: string, endDate: string): Report[] => {
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return reportDate >= start && reportDate <= end;
    });
  };

  const exportReports = (reportsToExport: Report[]) => {
    // Crear CSV
    const headers = [
      'No. Programación',
      'Funcionario',
      'Fecha',
      'Hora Entrada',
      'Hora Salida',
      'Ambiente',
      'Estado',
      'Observaciones'
    ];

    const csvContent = [
      headers.join(','),
      ...reportsToExport.map(report => [
        report.programmingNumber,
        `"${report.officialName}"`,
        report.date,
        report.entryTime,
        report.exitTime,
        `"${report.environmentName}"`,
        report.status,
        `"${report.observations || ''}"`
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

  const value: ReportsContextType = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportById,
    getReportsByOfficial,
    getReportsByDateRange,
    exportReports
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export default ReportsContext;
