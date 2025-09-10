# Etapa 1: Construir la aplicación con Node.js (modo desarrollo)
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todo el código de la aplicación
COPY . .

# Expone el puerto 5175 (o el puerto en el que se ejecuta la app de React)
EXPOSE 5173

# Inicia el servidor de desarrollo (esto es equivalente a npm run dev)
CMD ["npm", "run", "dev", "--", "--host"]