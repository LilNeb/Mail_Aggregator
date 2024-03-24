<template>
    <div class="summaries-container">
        <div v-for="(summary, index) in summaries" :key="index">
            <h2 class="category-heading">{{ summary.category }}</h2>
            <div v-for="(text, i) in summary.summaries" :key="`summary-${i}`">
                <!-- Utilize v-html to render generated HTML -->
                <p class="summary-text" v-html="renderMarkdown(text)"></p>
            </div>
        </div>
    </div>
</template>

<script>
import markdownit from 'markdown-it';

export default {
    props: {
        summaries: {
            type: Array,
            required: true
        }
    },
    methods: {
        // Render Markdown text into HTML
        renderMarkdown(text) {
            const md = markdownit();
            return md.render(text);
        }
    }
};
</script>

<style scoped>
.summaries-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Center the summary containers */
    margin: 20px auto; /* Center the container horizontally */
    padding: 10px;
    max-width: 33.33%; /* Take up 1/3 of the page width */
    background-color: #f9f9f9;
    border-radius: 5px;
}

.summary-text {
  font-size: 16px;
  line-height: 1.5;
  text-align: justify; /* Justifie le texte pour un rendu plus propre */
  margin-top: 5px;
  padding: 10px; /* Ajoute de l'espace autour du texte pour une meilleure lisibilité */
  background-color: #ffffff; /* Fond blanc pour les paragraphes de résumé */
  border-left: 3px solid #907f9a; /* Ajoute une bordure gauche pour distinguer les paragraphes */
  width: 100%; /* Assure que le texte prend toute la largeur du conteneur */
}

.category-heading {
  font-size: 24px;
  color: #333;
  margin-top: 20px;
  width: 100%; /* S'assure que le titre de la catégorie prend toute la largeur */
  text-align: center; /* Centre le texte du titre */
}
</style>
