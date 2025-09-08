// src/services/novelty.ts
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8001/novedades/novedades/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // O el storage correcto
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface NoveltyPayload {
  descripcion: string;
  ambiente?: number;
}

export const createNovelty = async (data: NoveltyPayload) => {
  try {
    const res = await axios.post(API_BASE, data, {
      headers: getAuthHeaders()
    });
    console.log('Respuesta OK:', res.data);
    return res.data;
  } catch (error: any) {
    if (error.response) {
        console.error('Error al registrar la novedad:', error.response?.data || error.message);
    } else {
        console.error('Error desconocido:', error.message);
    }
    throw error;
  }
};

export { getAuthHeaders };