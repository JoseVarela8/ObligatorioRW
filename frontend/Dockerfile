# Usa una imagen base de Node.js
FROM node:18 AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Usa una imagen base de Nginx para servir la aplicación Angular
# Sin embargo, en este caso usaremos 'ng serve' para desarrollo
CMD ["npm", "run", "start"]
