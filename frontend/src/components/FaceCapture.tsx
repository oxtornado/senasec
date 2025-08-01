import { useRef, useState } from 'react';
import Webcam from 'react-webcam'; // libreria para usar la camara
import axios from 'axios'; // conectar contenido con el backend

interface FaceCaptureProps {
    onCapture: (token: string) => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture }) => {
    const webcamRef = useRef<Webcam>(null); // referencia para tomar capturas
    const [capturing, setCapturing] = useState(false); // 
    const [status, setStatus] = useState(''); // muestra msj del proceso, fots en backend, tomando fotos...
    const captureMultiplePhotos = async () => { // funcion que se activa la oprimir el boton
        setCapturing(true); // inicio de captura
        setStatus('Capturando fotos...');
        const photos: Blob[] = [];
        // captura 5 fotos
        for (let i = 0; i < 3; i++) {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                const blob = await fetch(imageSrc).then(res => res.blob());
                photos.push(blob);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo
        }
        setStatus('Enviando al backend...');
        try {
            const formData = new FormData();
            photos.forEach((photo, index) => {
                formData.append('images', photo, `face_${index}.jpg`);
            });
            const response = await axios.post(
                'http://0.0.0.0:8001/register-face/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Respuesta del backend:', response.data);
            setStatus('Captura y envío exitoso');
            onCapture(response.data.face_token);
        } catch (error) {
            console.error('Error enviando al backend:', error);
            setStatus('Error al enviar imágenes');
        }
        setCapturing(false); //fin captura
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                videoConstraints={{
                    facingMode: 'user'
                }}
                className="rounded shadow"
            />
            <button
                onClick={captureMultiplePhotos}
                disabled={capturing}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
            >
                {capturing ? 'Capturando...' : 'Iniciar captura facial'}
            </button>
            {status && <p className="text-sm text-gray-600">{status}</p>}
        </div>
    );
};

export default FaceCapture;
