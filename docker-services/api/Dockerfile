# Définir l'image de base
FROM node:14-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Compiler le TypeScript en JavaScript
RUN npm run build

# Exposer le port sur lequel l'application s'exécute
EXPOSE ${PORT}

# Définir la commande pour démarrer l'application
CMD ["npm", "start"]
