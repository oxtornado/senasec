# SENASEC - Sistema de Seguridad Inteligente para Aulas

## Descripción

SENASEC es una aplicación web moderna para gestionar la seguridad y el control de equipos en aulas educativas. Permite administrar inventario de equipos, gestionar préstamos y reservas, con soporte multilingüe (español/inglés) y una interfaz moderna y responsiva.

## Características

- **Sistema de autenticación**: Registro de usuarios, inicio de sesión y gestión de perfiles.
- **Gestión de inventario**: Control de equipos con diferentes estados (Disponible, En uso, Mantenimiento).
- **Sistema de préstamos**: Solicitud, aprobación y devolución de equipos.
- **Soporte multilingüe**: Interfaz disponible en español e inglés.
- **Modo oscuro/claro**: Interfaz adaptable a las preferencias del usuario.
- **Dashboard**: Visualización de estadísticas y métricas importantes.
- **Calendario de reservas**: Planificación visual de préstamos y disponibilidad.
- **Sistema de notificaciones**: Alertas y recordatorios para usuarios.

## Tecnologías

### Frontend

- React con TypeScript
- Tailwind CSS para estilos
- React Router para navegación
- i18next para internacionalización
- Lucide React para iconos

### Backend

- Python con FastAPI
- Tortoise ORM para la gestión de base de datos
- SQLite/MySQL para almacenamiento de datos
- JWT para autenticación

## Estructura del proyecto

```
senasec/
├── frontend/           # Código React existente
└── backend/
    ├── app/
    │   ├── api/        # Endpoints de la API
    │   ├── core/       # Configuración central
    │   ├── db/         # Configuración de base de datos
    │   ├── models/     # Modelos Tortoise ORM
    │   ├── schemas/    # Esquemas Pydantic
    │   ├── services/   # Lógica de negocio
    │   └── utils/      # Utilidades
    ├── tests/          # Pruebas
    ├── .env.example    # Ejemplo de variables de entorno
    ├── requirements.txt # Dependencias
    └── main.py         # Punto de entrada
```

## Instalación y Ejecución

### Backend

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
cd senasec/backend
pip install -r requirements.txt

# Ejecutar servidor de desarrollo
uvicorn main:app --reload
```

### Frontend

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

## Despliegue

El proyecto está configurado para despliegue con Docker y CI/CD a través de GitHub Actions.

```bash
# Construir y ejecutar con Docker Compose
docker-compose up -d
```

## Documentación de la API

La documentación de la API está disponible en `/docs` o `/redoc` cuando el servidor está en ejecución.

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Contacto

Soporte: soporte@senasec.com
