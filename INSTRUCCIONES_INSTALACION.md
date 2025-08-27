# 🚀 SENASEC 2025 - INSTRUCCIONES DE INSTALACIÓN Y EJECUCIÓN

## 📋 REQUISITOS PREVIOS

Antes de ejecutar SENASEC 2025, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **Python** (versión 3.8 o superior)
   - Descargar desde: https://python.org/
   - Verificar instalación: `python3 --version`

---

## 🎯 INSTALACIÓN RÁPIDA

### **Paso 1: Abrir Terminal**
1. Presiona `Cmd + Espacio` para abrir Spotlight
2. Escribe "Terminal" y presiona Enter

### **Paso 2: Navegar al Proyecto**
```bash
cd /Users/$(whoami)/Desktop/senasec2025
```

### **Paso 3: Instalar Dependencias del Frontend**
```bash
npm install
```

### **Paso 4: Configurar Backend (Python)**
```bash
cd senasec/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## ▶️ EJECUCIÓN DEL PROYECTO

### **Opción 1: Ejecución Automática (Recomendada)**

Desde la carpeta principal del proyecto (`senasec2025`):

```bash
# Ejecutar todo el proyecto de una vez
./ejecutar_senasec.sh
```

### **Opción 2: Ejecución Manual**

**Terminal 1 - Backend:**
```bash
cd /Users/$(whoami)/Desktop/senasec2025/senasec/backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd /Users/$(whoami)/Desktop/senasec2025
npm run dev
```

---

## 🌐 ACCESO A LA APLICACIÓN

Una vez ejecutado el proyecto:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

### **Credenciales de Prueba:**
- **Usuario**: admin@senasec.com
- **Contraseña**: admin123

---

## 📱 CARACTERÍSTICAS RESPONSIVAS

El proyecto incluye optimizaciones completas para:

- ✅ **Móviles** (320px - 767px)
- ✅ **Tablets** (768px - 1023px) 
- ✅ **Desktop** (1024px+)

### **Funcionalidades Móviles:**
- Menú hamburguesa intuitivo
- Vista lista para inventario de equipos
- Calendario optimizado para táctil
- Modales responsivos

---

## 🛠️ COMANDOS ÚTILES

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview

# Limpiar node_modules
rm -rf node_modules && npm install
```

---

## 📂 ESTRUCTURA DEL PROYECTO

```
senasec2025/
├── src/                    # Código fuente frontend
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas principales
│   ├── hooks/             # Hooks personalizados
│   └── contexts/          # Contextos React
├── senasec/backend/       # Backend Python/FastAPI
├── public/                # Archivos estáticos
├── package.json           # Dependencias Node.js
└── tailwind.config.js     # Configuración CSS
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Error: "Command not found"**
```bash
# Verificar Node.js
node --version
npm --version

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Puerto en uso"**
```bash
# Cambiar puerto del frontend
npm run dev -- --port 3000

# Verificar procesos en puerto
lsof -ti:5173 | xargs kill -9
```

### **Error: Backend no inicia**
```bash
# Verificar Python
python3 --version

# Recrear entorno virtual
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📞 SOPORTE

Para problemas técnicos:
1. Verificar que todos los requisitos estén instalados
2. Revisar los logs en la terminal
3. Reiniciar el proyecto completamente

---

## ✅ VERIFICACIÓN DE INSTALACIÓN

Después de la instalación, verifica que todo funcione:

1. ✅ Frontend carga en http://localhost:5173
2. ✅ Backend responde en http://localhost:8000
3. ✅ Login funciona con credenciales de prueba
4. ✅ Navegación móvil (redimensionar ventana)
5. ✅ Vista de inventario cambia en móvil

**¡SENASEC 2025 está listo para usar!** 🎉
