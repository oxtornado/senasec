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
  const [emailCode, setEmailCode] = useState('');
  const [authMethod, setAuthMethod] = useState<'face' | 'email'>('face');

  const validateBeforeSubmit = (): boolean => {
    console.log("🧪 Validando datos:", { documento, authMethod, temporalToken, emailCode });

    if (!documento) {
      toast.error('Debes ingresar el número de documento');
      return false;
    }

    if (authMethod === 'face' && !temporalToken) {
      toast.error('Debes capturar tu rostro antes de iniciar sesión');
      return false;
    }

    if (authMethod === 'email' && !emailCode) {
      toast.error('Debes ingresar el código enviado por correo');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 handleSubmit triggered");

    if (!validateBeforeSubmit()) return;

    try {
      if (authMethod === 'face') {
        const res = await axios.post("http://localhost:8000/users/buscar-por-documento/", {
          documento,
        });

        const user = res.data;

        if (!user || !user.face_token) {
          toast.error('Usuario no encontrado o sin captura facial');
          return;
        }

        const formData = new FormData();
        formData.append('registered_token', user.face_token);
        formData.append('temporal_token', temporalToken);

        const compareRes = await axios.post('http://0.0.0.0:8001/compare-face/', formData);
        const result = compareRes.data;

        if (result.match) {
          toast.success('Inicio de sesión exitoso');
          setTimeout(() => navigate('/inventory'), 2000);
        } else {
          toast.error('La verificación facial falló');
        }

      } else if (authMethod === 'email') {
        const verifyRes = await axios.post('http://localhost:8000/users/verify-email-code/', {
          documento,
          code: emailCode,
        });

        if (verifyRes.data?.valid) {
          toast.success('Código verificado. Inicio de sesión exitoso');
          setTimeout(() => navigate('/inventory'), 2000);
        } else {
          toast.error('Código inválido');
        }
      }

    } catch (error: any) {
      console.error("❌ Error general:", error);
      const msg = error.response?.data?.error || 'Error en el proceso de inicio de sesión';
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
  {authMethod === 'email' && (
    <button
      type="button"
      onClick={async () => {
        if (!documento) {
          toast.error('Ingresa el número de documento antes de enviar el correo');
          return;
        }

        try {
          const res = await axios.post('http://localhost:8000/users/send-verification-email/', {
            documento,
          });

          if (res.data?.success) {
            toast.success('Correo de verificación enviado');
          } else {
            toast.error('No se pudo enviar el correo');
          }
        } catch (err: any) {
          console.error("❌ Error enviando correo:", err);
          const msg = err.response?.data?.error || 'Error al enviar el correo';
          toast.error(msg);
        }
      }}
      className="mt-2 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      Enviar Código al Correo
    </button>
  )}
</div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de autenticación</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod('face')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border ${
                    authMethod === 'face'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Reconocimiento Facial
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border ${
                    authMethod === 'email'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Código por Correo
                </button>
              </div>
            </div>

            {authMethod === 'face' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Captura Facial</label>
                <FaceCapture onCapture={(token) => setTemporalToken(token)} />
              </div>
            )}

            {authMethod === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Código de verificación</label>
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  !documento ||
                  (authMethod === 'face' && !temporalToken) ||
                  (authMethod === 'email' && !emailCode)
                }
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
