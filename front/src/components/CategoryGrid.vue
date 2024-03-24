<template>
    <!-- Category Grid -->
    <div class="categories-grid">
        <div
            v-for="(value, category) in categories"
            :key="category"
            class="category-square"
            @click="toggleCategory(category)"
            @mouseover="hoverCategory(category)"
            @mouseleave="hoverCategory(null)"
            :class="{ 'selected': selectedCategories.includes(category), 'hover': hover === category }"
        >
            <span class="category-text">{{ formatCategory(category) }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        categories: Object,
        selectedCategories: Array
    },
    data() {
        return {
            hover: null
        };
    },
    methods: {
        // Toggle category selection
        toggleCategory(category) {
            this.$emit('toggle-category', category);
        },
        // Set hover category
        hoverCategory(category) {
            this.hover = category;
        },
        // Format category text
        formatCategory(category) {
            return category.charAt(0).toUpperCase() + category.slice(1);
        }
    }
};
</script>

<style>
/* Category Styles */
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

.category-square:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.category-square.selected {
    transform: scale(1.02);
    filter: brightness(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
