import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUsers, updateUserAPI } from '../services/users';

export interface Users {
    id: number;
    username: string;
    fullname: string;
    documento: string;
    email: string;
    telefono: string;
    rol: 'admin' | 'instructor' | 'seguridad' | 'aseo' | 'inventario';
    fecha_registro: string;
    face_token: string;
    password?: string;
}

interface UserContextType {
    users: Users[];
    updateUser: (id: number, updatedUser: Partial<Users>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode }> = ({ children }) => {

    const [users, setUser] = useState<Users[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUser(data);
            } catch (error) {
                console.error('Error cargando usuarios:', error);
            }
        };

        loadUsers();
    }, []);

    const updateUser = async (id: number, updated: Partial<Users>) => {
        await updateUserAPI(id, updated);
        setUser(prev => 
            prev.map(u => u.id === id ? { ...u, ...updated } : u)
        );
    };

    return (
        <UserContext.Provider value={{
            users,
            updateUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}