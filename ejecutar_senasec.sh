#!/bin/bash

# 🚀 SENASEC 2025 - Script de Ejecución Automática
# Este script inicia automáticamente el frontend y backend

echo "🚀 Iniciando SENASEC 2025..."
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta senasec2025"
    exit 1
fi

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo SENASEC..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C para limpiar procesos
trap cleanup SIGINT

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Descárgalo desde https://nodejs.org/"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado. Descárgalo desde https://python.org/"
    exit 1
fi

# Instalar dependencias del frontend si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

# Configurar backend si es necesario
if [ ! -d "senasec/backend/venv" ]; then
    echo "🐍 Configurando entorno virtual de Python..."
    cd senasec/backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ../..
fi

echo ""
echo "🔥 Iniciando servicios..."
echo "========================="

# Iniciar backend en segundo plano
echo "🐍 Iniciando backend (Puerto 8000)..."
cd senasec/backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ../..

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar frontend en segundo plano
echo "⚛️  Iniciando frontend (Puerto 5173)..."
npm run dev &
FRONTEND_PID=$!

# Esperar un poco más
sleep 5

echo ""
echo "✅ SENASEC 2025 está ejecutándose!"
echo "=================================="
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 Backend:  http://localhost:8000"
echo ""
echo "📱 Credenciales de prueba:"
echo "   Usuario: admin@senasec.com"
echo "   Contraseña: admin123"
echo ""
echo "💡 Presiona Ctrl+C para detener todos los servicios"
echo ""

# Mantener el script ejecutándose
wait
