<template>
  <div id="app" class="container">
    <div class="logo-container">
      <img src="logo.png" alt="Logo" class="logo" style="width: 50px; height: 50px; margin-right: 10px;" />
      <h1 class="title">Mail-Aggregator | A PI² project</h1>
    </div>
    <CategoryGrid
      v-if="!categorySelected"
      :categories="categories"
      :selectedCategories="selectedCategories"
      @toggle-category="toggleCategory"
    />
    <SubmitClearBar
      v-if="!categorySelected"
      @clear-categories="clearCategories"
      @submit-categories="submitCategories"
    />
    <StatusMessage :messages="statusMessages" />
    <SummariesContainer v-if="categorySelected" :summaries="summaries" />
  </div>
</template>

<script>
import axios from 'axios';
import markdownit from 'markdown-it'
import CategoryGrid from './components/CategoryGrid.vue';
import SubmitClearBar from './components/SubmitClearBar.vue';
import StatusMessage from './components/StatusMessage.vue';
import SummariesContainer from './components/SummariesContainer.vue';

export default {
  data() {
    return {
      categories: {},
      selectedCategories: [],
      hover: null,
      statusMessages: [],
      summaries: [],
      categorySelected: false
    };
  },
  created() {
    this.fetchCategories();
  },
  components: {
    CategoryGrid,
    SubmitClearBar,
    StatusMessage,
    SummariesContainer
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/api/categories");
        this.categories = Object.keys(response.data).sort().reduce((sortedCategories, key) => {
          sortedCategories[key] = response.data[key];
          return sortedCategories;
        }, {});
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    toggleCategory(category) {
      const index = this.selectedCategories.indexOf(category);
      if (index === -1) {
        this.selectedCategories.push(category);
      } else {
        this.selectedCategories.splice(index, 1);
      }
    },
    clearCategories() {
      this.selectedCategories = [];
      this.statusMessages = [];
      this.summaries = [];
    },
    async submitCategories() {
      this.statusMessages = ["Starting submission process..."];
      let categorySummaries = [];
      this.categorySelected = true;
      
      for (let category of this.selectedCategories) {
        try {
          this.statusMessages.push(`$ Fetching newsletter for category: ${category}`);
          await this.$nextTick();
          
          const postResponse = await axios.post(`http://localhost:3000/api/markdown/${category}`);
          if (postResponse.data === "success!") {
            this.statusMessages.push(`Success: Newsletter for category: ${category} successfully fetched`);
            this.statusMessages.push(`$ Generating text for category: ${category}`);
            await this.$nextTick();
            
            const summaryResponse = await axios.get(`http://localhost:3020/api/summarize/${category}/5`);
            if (summaryResponse.status === 200) {
              this.statusMessages.push(`Success: Successfully synthesized text for category: ${category}`);
              categorySummaries.push({
                category,
                summaries: summaryResponse.data.summaries.map(s => s.summary)
              });
            }
          } else {
            this.statusMessages.push(`Error: Failed to fetch newsletter for category: ${category}`);
          }
        } catch (error) {
          console.error("Error in submitting category:", error);
          this.statusMessages.push(`Error: Exception in processing category: ${category}`);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      this.statusMessages.push("Submission process completed.");
      await this.$nextTick();
      
      setTimeout(() => {
        this.statusMessages =
        [];
        this.summaries = categorySummaries; // Stocke les résumés formatés avec les catégories
      }, 2000);
    },
    renderMarkdown(text) {
      const md = markdownit()
      console.log(md.render(text));
      return md.render(text); // Convertissez le Markdown en HTML
    },
  }
};
</script>

<style>
/* General Styles */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  margin: 0;
  background-color: #ffffff;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

/* Title Styles */
.title {
  flex: 0 0 10vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
}

</style>
