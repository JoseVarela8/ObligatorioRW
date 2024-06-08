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

# Construye la aplicación Angular
RUN npm run build

# Usa una imagen base de Nginx para servir la aplicación Angular
FROM nginx:alpine

# Copia los archivos construidos a la carpeta de Nginx
COPY --from=0 /app/dist/frontend /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando para correr Nginx
CMD ["nginx", "-g", "daemon off;"]

