<template>
  <div id="app" class="container">
    <div class="logo-container">
      <img src="logo.png" alt="Logo" class="logo" style="width: 50px; height: 50px; margin-right: 10px;" />
      <h1 class="title">Mail-Aggregator | A PI² project</h1>
    </div>
    <div class="categories-grid" v-if="!statusMessages.length && !summaries.length">
      <div
        v-for="(value, category) in categories"
        :key="category"
        class="category-square"
        @click="toggleCategory(category)"
        @mouseover="hover = category"
        @mouseleave="hover = null"
        :class="{ 'selected': selectedCategories.includes(category), 'hover': hover === category }"
      >
        <span class="category-text">{{ category.charAt(0).toUpperCase() + category.slice(1) }}</span>
      </div>
    </div>
    <div class="submit-clear-bar" v-if="!statusMessages.length && !summaries.length">
      <div class="clear-action" @click="clearCategories">
        CLEAR
      </div>
      <div class="submit-action" @click="submitCategories">
        SUBMIT
      </div>
    </div>
    <div class="status-messages" v-if="statusMessages.length">
      <div v-for="(message, index) in statusMessages" :key="index">
        {{ message }}
      </div>
    </div>
    <div class="summaries-container" v-if="summaries.length">
      <div v-for="(summary, index) in summaries" :key="index">
        <h2 class="category-heading">{{ summary.category }}</h2>
        <div v-for="(text, i) in summary.summaries" :key="`summary-${i}`">
          <p class="summary-text">{{ text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: {},
      selectedCategories: [],
      hover: null,
      statusMessages: [],
      summaries: [],
    };
  },
  created() {
    this.fetchCategories();
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
  }
};
</script>

<style>
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

.title {
  flex: 0 0 10vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
}

.category-text {
  color: rgb(0, 0, 0);
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;
}

.categories-grid {
  flex: 0 0 80vh;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: minmax(100px, auto);
  gap: 10px;
  overflow-y: auto;
  padding: 10px;
  margin: 0;
}

.category-square {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f0f0f0;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s, filter 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1);
}

.category-square:hover, .category-square.selected {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.submit-clear-bar {
  flex: 0 0 10vh;
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #f0f0f0;
}

.submit-action, .clear-action {
  flex: 1;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #898989;
  color: white;
}

.submit-action:hover {
  background-color: #907f9a;
}

.clear-action:hover {
  background-color: #ba8181;
}

.status-messages {
  padding: 20px;
  background-color: #0d0d0d;
  color: #00ff00;
  border-radius: 5px;
  margin: 20px;
  text-align: left;
  overflow-y: auto;
  max-height: 80vh;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre;
}

.summaries-container {
  margin: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.category-heading {
  font-size: 24px;
  color: #333;
  margin-top: 20px;
}

.summary-text {
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  margin-top: 5px;
}
</style>
