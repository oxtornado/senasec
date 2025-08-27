#!/bin/bash
# Script de despliegue para SENASEC
# Este script automatiza el proceso de despliegue del sistema SENASEC

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando despliegue de SENASEC ===${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado. Por favor, instale Docker antes de continuar.${NC}"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose no está instalado. Por favor, instale Docker Compose antes de continuar.${NC}"
    exit 1
fi

# Construir las imágenes Docker
echo -e "${YELLOW}Construyendo imágenes Docker...${NC}"
docker-compose build

# Verificar si la construcción fue exitosa
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: La construcción de las imágenes Docker falló.${NC}"
    exit 1
fi

# Iniciar los contenedores
echo -e "${YELLOW}Iniciando contenedores...${NC}"
docker-compose up -d

# Verificar si los contenedores se iniciaron correctamente
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudieron iniciar los contenedores.${NC}"
    exit 1
fi

# Esperar a que la base de datos esté lista
echo -e "${YELLOW}Esperando a que la base de datos esté lista...${NC}"
sleep 10

# Ejecutar script de inicialización
echo -e "${YELLOW}Ejecutando script de inicialización...${NC}"
docker-compose exec backend python init_setup.py

# Verificar si la inicialización fue exitosa
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: La inicialización falló.${NC}"
    exit 1
fi

echo -e "${GREEN}=== Despliegue completado con éxito ===${NC}"
echo -e "${GREEN}La aplicación está disponible en: http://localhost${NC}"
echo -e "${GREEN}La API está disponible en: http://localhost/api${NC}"
echo -e "${GREEN}La documentación de la API está disponible en: http://localhost/docs${NC}"
echo -e "${YELLOW}Credenciales de administrador:${NC}"
echo -e "${YELLOW}Usuario: admin${NC}"
echo -e "${YELLOW}Contraseña: admin123${NC}"
echo -e "${RED}¡IMPORTANTE! Cambie la contraseña después del primer inicio de sesión.${NC}"
