// src/services/equipment.ts
import axios from 'axios';
import { Equipment } from '../contexts/EquipmentContext';

const API_BASE = 'http://127.0.0.1:8001/equipos/equipos/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // O el storage correcto
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchEquipment = async (): Promise<Equipment[]> => {
  const response = await axios.get(API_BASE, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateEquipmentAPI = async (id: number, data: Partial<Equipment>) => {
  try {
    const res = await axios.put(`${API_BASE}${id}/`, data, {
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

export { getAuthHeaders };


// export const updateEquipmentAPI = async (id: number, data: Partial<Equipment>) => {
//   await axios.put(`${API_BASE}${id}/`, data, {
//     headers: getAuthHeaders()
//   });
// };
