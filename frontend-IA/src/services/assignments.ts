// src/services/users.ts
import axios from 'axios';
import { Assignments, AssignmentsInput } from '../contexts/AssignmentsContext';

const API_BASE = 'http://127.0.0.1:8001/programaciones/programaciones/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // O el storage correcto
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchAssignments = async (): Promise<Assignments[]> => {
  const response = await axios.get(API_BASE, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createAssignmentAPI = async (data: AssignmentsInput) => {
  try {
    const res = await axios.post(API_BASE, data, {
      headers: getAuthHeaders()
    });
    console.log('Programación creada:', res.data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error al crear programación:', error.response.data);
    } else {
      console.error('Error desconocido:', error.message);
    }
    throw error;
  }
};


export const updateAssignmentAPI = async (id: number, data: Partial<AssignmentsInput>) => {
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

export const deleteAssignmentAPI = async (id: number) => {
    try {
        const res = await axios.delete(`${API_BASE}${id}/`, {
            headers: getAuthHeaders()
        });
        console.log('Programación eliminada:', res.data);
        return res.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Error al eliminar programación:', error.response.data);
        } else {
            console.error('Error desconocido:', error.message);
        }
        throw error;
    }
};


export { getAuthHeaders };