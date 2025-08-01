import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Cloud } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import FaceCapture from '../components/FaceCapture';

const Login = () => {
  const navigate = useNavigate();
  const [documento, setDocumento] = useState('');
  const [temporalToken, setTemporalToken] = useState('');

  const validateBeforeSubmit = (): boolean => {
    console.log("🧪 Validando datos:", { documento, temporalToken });
    if (!documento) {
      toast.error('Debes ingresar el número de documento');
      return false;
    }

    if (!temporalToken) {
      toast.error('Debes capturar tu rostro antes de iniciar sesión');
      return false;
    }

    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 handleSubmit triggered");

    // Validación inicial
    if (!validateBeforeSubmit()) return;

    if (!documento) {
      toast.error('Debes ingresar el número de documento');
      return;
    }

    if (!temporalToken) {
      toast.error('Captura facial no realizada');
      return;
    }

    try {
      // Paso 1: Buscar usuario por documento
      console.log("📡 Consultando usuario...");
      const res = await axios.post("http://localhost:8000/users/buscar-por-documento/", {
        documento: documento,
      });


      const user = res.data;

      if (!user) {
        toast.error('Usuario no encontrado');
        return;
      }

      if (!user.face_token) {
        toast.error('Usuario no tiene una captura facial registrada');
        return;
      }

      console.log("✅ Usuario encontrado:", user);

      // Paso 2: Comparar rostro
      console.log("📸 Token facial temporal:", temporalToken);
      console.log("🔐 Comparando rostro...");

      const formData = new FormData();
      formData.append('registered_token', user.face_token);
      formData.append('temporal_token', temporalToken);

      const compareRes = await axios.post('http://0.0.0.0:8001/compare-face/', formData);
      const result = compareRes.data;

      console.log("🎯 Resultado comparación:", result);

      if (result.match) {
        toast.success('Inicio de sesión exitoso');
        setTimeout(() => navigate('/inventory'), 2000);
      } else {
        toast.error('La verificación facial falló');
      }

    } catch (error: any) {
      console.error("❌ Error general:", error);
      const msg = error.response?.data?.error || 'Error en el proceso de validación facial';
      toast.error(msg);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center text-blue-600">
            <Lock className="h-12 w-12" />
            <Cloud className="h-12 w-12 -ml-4" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">SENASEC</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema de Seguridad Inteligente para Aulas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Documento</label>
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Captura Facial</label>
              <FaceCapture onCapture={(token) => setTemporalToken(token)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!documento || !temporalToken}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿No tienes una cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
