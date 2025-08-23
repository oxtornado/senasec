## ZAJUDEM SOFTWARE

ZAJUDEM es un servicio de software desarrollado por la empresa Senasec. Este sistema integra reconocimiento facial con inteligencia artificial para permitir el acceso del profesorado a las instalaciones educativas. Además, proporciona una plataforma para visualizar las aulas disponibles y los horarios de clase junto con sus respectivos cursos.

## Tecnologías utilizadas

- **Frontend:** React + Vite (TypeScript)
- **Backend:** FastAPI (Python), Django REST Framework
- **Base de datos:** PostgreSQL
- **APIs:** API RESTful
- **Hardware:** Arduino (C) con servomotor y otros componentes

## 🔧 Requisitos

- Python 3.10 o superior
- Node.js 18 o superior
- npm (viene con Node.js)
- postgreSQL 

---

## ⚙️ Instalación

### Base de datos dirigida por Django (postgreSQL)
>[!TIP]
> Crear un entorno virtual dentro del proyecto y activarlo
```bash
python -m venv venv
.\venv\Scripts\Activate   
```
> Instalar las dependencias con pip freeze:
```bash
pip install -r requirements.txt
```
> Y encender el servidor para el puerto http://127.0.0.1:8000/:
```bash
python manage.py runserver
```


>[!IMPORTANT]
> 1. Crear una base de datos PostgreSQL con los mismos datos de settings.py (cambiar nombre de la base de datos, usuario y contraseña de postgresql)
> 2. Entrar a la base de datos y actualizarla (refresh)

>[!NOTE]
> Estos son los endpoints de SENASEC (GET)
> 1. Entrada y salida de usuarios
```bash
http://127.0.0.1:8000/login/
http://127.0.0.1:8000/api/token/refresh/
localhost:8000/logout/
.\venv\Scripts\Activate   
```

> 2. Usuarios
```bash
http://127.0.0.1:8000/users/profile/
http://127.0.0.1:8000/users/usuarios/
```

> 3. Fichas
```bash
http://127.0.0.1:8000/fichas/fichas/
```

> 4. Ambiente
```bash
http://127.0.0.1:8000/ambiente/ambiente/
```

> 5. Novedades
```bash
http://127.0.0.1:8000/novedades/novedades/
```

> 6. Equipos
```bash
http://127.0.0.1:8000/equipos/equipos/
```

> 7. Programaciones
```bash
http://127.0.0.1:8000/programaciones/programaciones/
```

> 8. Reportes
```bash
http://127.0.0.1:8000/reportes/reportes/
```

---
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