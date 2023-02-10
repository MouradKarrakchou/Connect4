# Utiliser une image Node.js en utilisant une image parente
FROM node:16.13.2

ENV NODE_ENV=production

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de l'application dans le répertoire de travail
COPY . .

# Installer les dépendances de l'application
RUN npm install

# Exposer le port 8000
EXPOSE 8000

# Définir la commande à exécuter pour démarrer l'application
CMD ["npm", "start"]
