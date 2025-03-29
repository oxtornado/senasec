## Senasec

Senasec es un servicio de software desarrollado por la empresa Zajudem. Este sistema integra reconocimiento facial con inteligencia artificial para permitir el acceso del profesorado a las instalaciones educativas. Además, proporciona una plataforma para visualizar las aulas disponibles y los horarios de clase junto con sus respectivos cursos.

## Tecnologías utilizadas

- **Frontend:** React + Vite (TypeScript)
- **Backend:** FastAPI (Python), Django REST Framework
- **Base de datos:** MySQL
- **APIs:** API RESTful
- **Hardware:** Arduino (C) con servomotor y otros componentes

## Instalación

### Requisitos previos
- Node.js y npm instalados
- Python y pip instalados
- MySQL configurado
- Arduino IDE si se desea probar la integración con hardware

### Instalación del frontend
```sh
# Clonar el repositorio
git clone https://github.com/tu_usuario/senasec.git
cd senasec/frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Instalación del backend
```sh
cd ../backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows usar venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar el servidor FastAPI
uvicorn main:app --reload
```

### Instalación del backend (DRF)
```sh
# Crear proyecto
django-admin startproject example

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows usar venv\Scripts\activate

# Instalar dependencias
pip install django
pip install djangorestframework
pip install psycopg2

# Aplicar las migraciones y correr el servidor
cd example

python manage.py makemigrations

python manage.py migrate

python manage.py runserver
```

### Configuración de la base de datos
1. Crear una base de datos en MySQL con el nombre `senasec`.
2. Configurar las credenciales de conexión en el archivo `.env` del backend.
3. Ejecutar las migraciones necesarias (si aplica).

### Instalación en Arduino
1. Conectar el Arduino y abrir el IDE de Arduino.
2. Subir el código en lenguaje C proporcionado en el directorio `arduino/`.
3. Conectar el servomotor y otros componentes según el esquema proporcionado.

## Uso del sistema
1. **Acceso mediante reconocimiento facial:** Los profesores pueden acceder al sistema escaneando su rostro.
2. **Consulta de aulas disponibles:** La plataforma muestra las aulas libres en tiempo real.
3. **Visualización de horarios:** Se puede consultar el horario de clases por curso.
4. **Demostración con hardware:** Un Arduino con servomotor puede simular el desbloqueo de una puerta tras la autenticación.

## Factor diferencial
- Integración de **reconocimiento facial con IA** para mejorar la seguridad y eficiencia.
- **Gestión optimizada de espacios y horarios** en instituciones educativas.
- **Uso de hardware (Arduino)** para una demostración práctica de acceso seguro.
- **Estructura modular** que permite escalabilidad y fácil mantenimiento del software.

## Contribución 
- **Etapas de la contribución:**
- **1.Planeación:**
Antes de hacer una contribución haga el ejercicio de plantear y formular de manera adecuada el cambio que va a realizar (actualizar, añadir o eliminar).

- **2.Edición:**
Debe tener en cuenta que por motivos de optimización y mantenimientó del software la edición del codigo para actualizar, añadir o eliminar debe realizarce de manera puntual afectando la menor cantidad de modulos y archivos (se espera *un* cambio que solucione *un* problema).

- **3.Pull Request:**
Como se menciona en el apartado **"Edición"** se espera que las contribuciones den solución a *un* problema especifico, asi mismo el Pull Request debe contener *un* cambio a ser valorado, esto con el fin de tener una mejor estructura y una mejor lectura de historial.
- **Sintaxis:**
- **Encabezado:**
```sh
acción: mencione el proposito del pr.
```
- **Descripción:**
```sh
En esta parte describa de manera detallada el cambio que hizo y describa los modulos y archivos afectados.
```

- **Ejemplo:**
- **Encabezado**
```sh
actualización: mejora en la logica de inicio de sesión
```
- **Descripción:**
```sh
La logica del inicio de sesión no sera vulnerable a inyecciones SQL debido a la importacion de la libreria "nombre de la libreria" en la direccion /user/login/login.php
```

- **Nota:**
De ser posible espere que un integrante del grupo acepte el pr, en dado caso de aceptar un pr que cause problemas en producción la persona que acepto ese pr asumira las consecuncias dando solución al problema generado.

## Licencia
Este proyecto está bajo la licencia MIT.

---
Para más información, contacta a [Zajudem](mailto:dnielussa@gmail.com) o revisa la [documentación oficial del proyecto](#).

