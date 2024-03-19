<template>
  <div id="app" class="container">
    <h1 class="title">Mail Aggregator</h1>
    <div class="categories-grid">
      <div
        v-for="(value, category) in categories"
        :key="value.id"
        class="category-square"
        @click="toggleCategory(value.id)"
        @mouseover="hover = value.id"
        @mouseleave="hover = null"
        :class="{ 'selected': selectedCategories.includes(value.id), 'hover': hover === value.id }"
      >
        {{ category }}
      </div>
    </div>
    <div class="submit-clear-bar">
      <div class="clear-action" @click="clearCategories">
        CLEAR
      </div>
      <div class="submit-action" @click="submitCategories">
        SUBMIT
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
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/api/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    toggleCategory(id) {
      const index = this.selectedCategories.indexOf(id);
      if (index === -1) {
        this.selectedCategories.push(id);
      } else {
        this.selectedCategories.splice(index, 1);
      }
    },
    clearCategories() {
      this.selectedCategories = [];
    },
    submitCategories() {
      console.log('Selected categories:', this.selectedCategories);
      // Further processing...
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.container {
  text-align: center;
  max-width: 100%;
  font-family: 'Roboto', sans-serif;
}

.title {
  margin-bottom: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding: 10px;
}

.category-square {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.category-square.selected,
.category-square.hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.submit-clear-bar {
  display: flex;
  margin-top: 20px;
}

.submit-action,
.clear-action {
  flex: 1;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-action {
  background-color: #898989; /* Green background */
  color: white;
}

.clear-action {
  background-color: #898989; /* Red background */
  color: white;
}

.submit-action:hover {
  background-color: #73709a; /* Darker green background */
}

.clear-action:hover {
  background-color: #ba8181; /* Darker red background */
}
</style>
