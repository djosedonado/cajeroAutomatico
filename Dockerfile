# Usa una imagen base con Node.js
FROM node:alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY package.json package-lock.json /app/
RUN npm install

# Copia el resto de la aplicación al contenedor
COPY . /app/

# Expone el puerto 8081 para Metro Bundler
EXPOSE 8081

# Comando para iniciar la aplicación
CMD ["npm", "start"]

