import React, { useState } from 'react';
import { Lock, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoginFace from '../components/LoginFace';

const LoginAula: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>("");

    // Callback que viene desde LoginFace.tsx
    const handleFaceLoginResult = (result: { success: boolean; error?: string }) => {
        if (result.success) {
            setStatus("✅ Inicio de sesión exitoso");
            toast.success("Bienvenido 👋");
            navigate('/dashboard/inventory');
        } else {
            if (result.error === "no_match") {
                setStatus("❌ Rostro no coincide con el registrado");
                toast.error("Rostro no coincide");
            } else if (result.error === "server_error") {
                setStatus("⚠️ Error en el servidor");
                toast.error("Error en el servidor");
            } else {
                setStatus("❌ Error en el inicio de sesión");
                toast.error("No se pudo iniciar sesión");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="flex items-center text-blue-600">
                        <Lock className="h-12 w-12" />
                        <Cloud className="h-12 w-12 -ml-4" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    SENASEC
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-white">
                    Sistema de Seguridad Inteligente para Aulas
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Aquí se inyecta el componente de LoginFace */}
                    <LoginFace/>

                    {status && (
                        <p className="mt-4 text-center text-sm font-medium 
                                      text-gray-700 dark:text-white">
                            {status}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginAula;
