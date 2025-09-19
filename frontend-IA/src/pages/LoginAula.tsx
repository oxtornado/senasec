import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Cloud, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
// @ts-ignore
import { login } from '../services/auth';
import LoginFace from '../components/LoginFace';

const Login = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [faceValidated, setFaceValidated] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!faceValidated) {
            toast.error("Debes validar tu rostro antes de continuar");
            setLoading(false);
            return;
        }

        try {
            await login(password);
            toast.success('Inicio de sesión exitoso');
            navigate('/dashboard/inventory');
        } catch (error) {
            toast.error('Contraseña incorrecta');
        } finally {
            setLoading(false);
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
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Facial login */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Sesión facial
                            </label>

                            {/* Pasamos callback para actualizar faceValidated */}
                            <LoginFace/>

                            {!faceValidated && (
                                <p className="mt-2 text-sm text-red-500">Debes validar tu rostro</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => toast("Se usará recuperación alternativa")}
                                    className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
                                >
                                    <Camera className="w-4 h-4 mr-1" /> No puedo iniciar sesión facialmente
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
