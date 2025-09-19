// src/services/users.ts
import axios from 'axios';
import { Reportes, ReportesInput } from '../contexts/ReportsContext';

const API_BASE = 'http://127.0.0.1:8001/reportes/reportes/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // O el storage correcto
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchReportes = async (): Promise<Reportes[]> => {
  const response = await axios.get(API_BASE, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createReporteAPI = async (data: ReportesInput) => {
  try {
    const res = await axios.post(API_BASE, data, {
      headers: getAuthHeaders()
    });
    console.log('Reporte creado:', res.data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error al crear reporte:', error.response.data);
    } else {
      console.error('Error desconocido:', error.message);
    }
    throw error;
  }
};


export const updateReporteAPI = async (id: number, data: Partial<ReportesInput>) => {
    try {
        const res = await axios.patch(`${API_BASE}${id}/`, data, {
            headers: getAuthHeaders()
        });
        console.log('Respuesta OK:', res.data);
        return res.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Error del servidor (detalle):', error.response.data);
        } else {
            console.error('Error desconocido:', error.message);
        }
        throw error;
    }
};

export const deleteReporteAPI = async (id: number) => {
    try {
        const res = await axios.delete(`${API_BASE}${id}/`, {
            headers: getAuthHeaders()
        });
        console.log('Reporte eliminado:', res.data);
        return res.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Error al eliminar reporte:', error.response.data);
        } else {
            console.error('Error desconocido:', error.message);
        }
        throw error;
    }
};


export { getAuthHeaders };