## Scraping de substack

récupérer les catégories et leurs ids (utiles pour les chemins d'API) : https://substack.com/api/v1/categories

## Routes API

"getPostsUrlsFromCategory" : renvoie une liste des top 50 posts de la catégorie choisie avec l'URL associée
http://localhost:3030/api/getPostsUrlsFromCategory/:categoryName (e.g. "finance")

"getCategoriesAndId" : renvoie l'ID des catégorie (et l'écrit en dure dans "local-data/categories-and-id.json") et leurs ID associées
http://localhost:3030/api/getCategoriesAndId

(convertir les posts en markdown : https://github.com/timf34/Substack2Markdown)
