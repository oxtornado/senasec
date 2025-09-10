# Usa una imagen de Python base
FROM python:3.10-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias del sistema necesarias para Django y PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copiar el archivo de dependencias
COPY requeriments.txt .

# Instalar las dependencias de Python
RUN pip install -r requeriments.txt

# Copiar el resto del código de Django
COPY . .

# Exponer el puerto donde correrá Django (el puerto por defecto es 8000)
EXPOSE 8001

COPY wait_for_db.sh /wait_for_db.sh
RUN chmod +x /wait_for_db.sh

# Comando para ejecutar el servidor Django
CMD ["/wait_for_db.sh", "python", "manage.py", "runserver", "0.0.0.0:8001"]
