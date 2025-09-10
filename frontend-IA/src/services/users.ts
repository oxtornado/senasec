// src/services/users.ts
import axios from 'axios';
import { Users } from '../contexts/UsersContext';

const API_BASE = 'http://127.0.0.1:8001/users/usuarios/';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // O el storage correcto
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchUsers = async (): Promise<Users[]> => {
  const response = await axios.get(API_BASE, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateUserAPI = async (id: number, data: Partial<Users>) => {
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

export const deleteUserAPI = async (id: number) => {
    try {
        const res = await axios.delete(`${API_BASE}${id}/`, {
            headers: getAuthHeaders()
        });
        console.log('Usuario eliminado:', res.data);
        return res.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Error al eliminar usuario:', error.response.data);
        } else {
            console.error('Error desconocido:', error.message);
        }
        throw error;
    }
};


export { getAuthHeaders };