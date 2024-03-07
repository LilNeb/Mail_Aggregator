## Description du projet 
Synthèse de newsletters grâce à de l'IA

## Routes API

- **[POST] http://localhost:3000/api/markdown/:category** (ex: finance) : requete POST qui recupère les 50 top posts d'une catégorie pourles envoyer au micro-service python qui va scrapper les URLs et les convertir fichiers markdown dans `/local-data/scrapped-posts/finance`.   
- **[GET] http://localhost:3020/api/summarize/:category** (ex: finance) : Lis les fichiers .md contenus dans le dossier `/local-data/scrapped-posts/finance` pour en faire une sythèse avec l'API chatGPT   
- **[GET] http://localhost:3000/api/categories** : Récupère toutes les catégories existantes et leurs ID sur substack et les sauvegarde dans le fichier `local-data/categories-and-id.json`.   

## How to use

- Créer un .env en ajoutant sa clé API chatGPT
- Lancer un `docker-compose up --build` depuis la racine du projet (--build seulement la première fois pour créer les images Docker)

## Resources

récupérer les catégories et leurs ids (utiles pour les chemins d'API) : https://substack.com/api/v1/categories
