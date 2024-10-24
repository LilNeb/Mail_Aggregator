<template>
    <div class="summaries-container">
        <div v-for="(summary, index) in summaries" :key="index">
            <!-- Display the category heading -->
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
        // Render markdown text using markdown-it library
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
    align-items: center;
    margin: 20px auto;
    padding: 10px;
    max-width: 33.33%;
    background-color: #f9f9f9;
    border-radius: 5px;
}

.summary-text {
  font-size: 16px;
  line-height: 1.5;
  text-align: justify;
  margin-top: 5px;
  padding: 10px;
  background-color: #ffffff;
  border-left: 3px solid #907f9a;
  width: 100%;
}

.category-heading {
  font-size: 24px;
  color: #333;
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
</style>
