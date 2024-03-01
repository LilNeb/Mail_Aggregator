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
RUN npm install openai@^4.0.0
RUN npm install winston
RUN npm run build

# Exposer le port sur lequel l'application s'exécute
EXPOSE ${PORT_MS2}

# Définir la commande pour démarrer l'application
CMD ["npm", "start"]
