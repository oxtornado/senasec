import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // manipulacion del DOM para redirigir en el logueo


const LoginFace: React.FC = () => {
    const navigate = useNavigate();
    const webcamRef = useRef<Webcam>(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const captureAndLogin = async () => {
        if (!email) {
            setStatus('Por favor ingresa tu email');
            return;
        }

        setLoading(true);
        setStatus('Capturando y verificando rostro...');

        const screenshot = webcamRef.current?.getScreenshot();
        if (!screenshot) {
            setStatus('No se pudo capturar imagen');
            setLoading(false);
            return;
        }

        try {
            const blob = await fetch(screenshot).then(res => res.blob());
            const formData = new FormData();
            formData.append('email', email);
            formData.append('image', blob, 'login_face.jpg');

            const response = await axios.post('http://localhost:8000/login-face/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
        });

        const data = response.data;
        console.log('Respuesta backend:', data);

        if (data.access) {   // Aquí chequeamos el token access que devuelve DRF
            localStorage.setItem('token', data.access);
            }

        if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }

        if (data.access) {
            setStatus('✅ Rostro verificado. Bienvenido');
            navigate('/dashboard/inventory');
        } else {
            setStatus('❌ Rostro no coincide o no se entregó token');
        }
        } finally {
        setLoading(false);
        }
    };

    return (
    <div className="flex flex-col items-center space-y-4">
        <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            className="rounded shadow"
        />
    <input
        type="email"
        placeholder="Correo registrado"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 rounded w-64"
        />
    <button
        onClick={captureAndLogin}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
            {loading ? 'Verificando...' : 'Iniciar sesión con rostro'}
    </button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
    );
};

export default LoginFace;