import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Cloud } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // check email exists in usuarios (Django, port 8000)
  const checkEmailExists = async (): Promise<boolean> => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/usuarios/");
      const found = res.data.some((u: any) => u.email === email);
      if (!found) {
        setMessage("El correo no existe en el sistema");
        return false;
      }
      return true;
    } catch (err: any) {
      console.error("Error fetching usuarios:", err);
      setMessage("Error verificando el correo");
      return false;
    }
  };

  // 8002: send code
  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const exists = await checkEmailExists();
    if (!exists) {
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8002/send-code", { email });
      setMessage("Código enviado a tu correo");
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error al enviar código");
    } finally {
      setLoading(false);
    }
  };

  // 8002: verify code
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const exists = await checkEmailExists();
    if (!exists) {
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8002/verify-code", { email, code });
      setMessage("Código verificado con éxito");
      setVerified(true);
    } catch (err: any) {
      console.error(err.response || err);
      setMessage(err.response?.data?.detail || "Error al verificar código");
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  // 8000: reset password
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);

    const exists = await checkEmailExists();
    if (!exists) {
      setLoading(false);
      return;
    }

    try {
      await axios.patch("http://127.0.0.1:8000/reset-password/", {
        email,
        new_password: password,
      });
      setMessage("Contraseña actualizada con éxito");
      
      // Navigate to login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 second delay to show success message
      
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Error al actualizar contraseña");
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
          {/* Send code form */}
          <form className="space-y-6" onSubmit={sendCode}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                className="mt-1 block w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm
                           placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </form>

          {/* Verify code form */}
          <form className="space-y-6 mt-6" onSubmit={verifyCode}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Código de verificación
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                className="mt-1 block w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm
                           placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700 dark:text-white">{message}</p>
          )}

          {/* Reset password form */}
          {verified && (
            <form className="space-y-6 mt-6" onSubmit={resetPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm
                            placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-800 rounded-md shadow-sm
                            placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                          bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;