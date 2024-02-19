# Utiliser une image de base Python
FROM python:3.8-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier du script dans le conteneur
COPY post_scrapper.py /app

# Installer Flask et les dépendances nécessaires
RUN pip install Flask requests beautifulsoup4 html2text

# Exposer le port sur lequel Flask s'exécute
EXPOSE 3010

# Commande pour lancer l'application Flask
CMD ["python", "post_scrapper.py"]
