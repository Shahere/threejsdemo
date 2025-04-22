# Utilise une image Node officielle
FROM node:23

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json en priorité pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste des fichiers du projet
COPY . .

# Exposer le port utilisé par ton app (change le si nécessaire)
EXPOSE 5173

# Lancer l'application
CMD ["npm", "run", "start"]
