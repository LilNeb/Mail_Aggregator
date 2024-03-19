<template>
  <div id="app">
    <h2>Mail Aggregator - Health Articles</h2>
    <form @submit.prevent="getArticles">
      <label for="category">Category:</label>
      <select id="category" v-model="selectedCategory">
        <option value="">All</option>
        <option value="health">Health</option>
      </select>
      <label for="message">Message:</label>
      <input type="text" id="message" v-model="message">
      <button type="submit">Get Articles</button>
    </form>
    <ul v-if="articles">
      <li v-for="article in articles" :key="article.title">
        {{ article.title }}
      </li>
    </ul>
    <p v-else>No articles found.</p>
    <p v-if="responseData">{{ responseData }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedCategory: "",
      message: "",
      articles: null,
      responseData: null,
    };
  },
  methods: {
    async getArticles() {
      const url = `http://localhost:3000/api/markdown/health`;
      let params = "";
      if (this.selectedCategory) {
        params = `?category=${this.selectedCategory}`;
      }

      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const data = {
          message: this.message,
        };
        const response = await axios.post(url + params, data, { headers });
        if (!response.ok) {
          throw new Error(`Error fetching articles: ${response.status}`);
        }
        this.responseData = await response.json();
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Optional: add styles */
</style>
