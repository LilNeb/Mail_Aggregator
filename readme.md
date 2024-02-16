## Scraping de substack

récupérer les catégories et leurs ids (utiles pour les chemins d'API) : https://substack.com/api/v1/categories

## Routes API

"postUrlsToMicroservice" : requete POST qui recupère les 50 top posts d'une catégorie pourles envoyer au micro-service python qui va scrapper les URLs et les convertir en markdown dans /local-data/scrapped-posts.
http://localhost:3000/api/postUrlsToMicroservice/:categoryName (ex: finance)
"getPostsUrlsFromCategory" : renvoie une liste des top 50 posts de la catégorie choisie avec l'URL associée
http://localhost:3000/api/getPostsUrlsFromCategory/:categoryName (ex: finance)

"getCategoriesAndId" : renvoie l'ID des catégorie (et l'écrit en dure dans "local-data/categories-and-id.json") et leurs ID associées
http://localhost:3000/api/getCategoriesAndId

## How to use

- Créer un .env avec les bonnes values des variables d'environnement
- Lancer un `docker-compose up` depuis la racine du projet
