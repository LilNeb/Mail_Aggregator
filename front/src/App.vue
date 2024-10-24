// src/App.vue
<template>
  <div id="app" class="container">
    <!-- Afficher le loader pendant la vérification -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- Afficher le contenu normal si l'utilisateur a payé -->
    <div v-else-if="hasPaid">
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

    <!-- Afficher le paywall si l'utilisateur n'a pas payé -->
    <div v-else class="paywall-container">
      <div class="welcome-message">
        <h1>Bienvenue sur notre plateforme</h1>
        <p>Pour accéder à tous nos contenus, un paiement unique de 1 sat est requis.</p>
        
        <LightningWallet @wallet-ready="handleWalletReady" />
        
        <button 
          v-if="walletReady && !showPaywall" 
          @click="showPaywall = true" 
          class="pay-button"
        >
          Accéder au contenu
        </button>

        <LightningPaywall 
          v-if="showPaywall"
          :show="showPaywall"
          @close="closePaywall"
          @payment-success="handlePaymentSuccess"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CategoryGrid from './components/CategoryGrid.vue';
import SubmitClearBar from './components/SubmitClearBar.vue';
import StatusMessage from './components/StatusMessage.vue';
import SummariesContainer from './components/SummariesContainer.vue';
import LightningWallet from './components/LightningWallet.vue';
import LightningPaywall from './components/LightningPaywall.vue';

export default {
  name: 'App',
  components: {
    CategoryGrid,
    SubmitClearBar,
    StatusMessage,
    SummariesContainer,
    LightningWallet,
    LightningPaywall
  },
  data() {
    return {
      // État du paywall
      isLoading: true,
      hasPaid: false,
      showPaywall: false,
      walletReady: false,
      
      // État de l'application originale
      categories: {},
      selectedCategories: [],
      statusMessages: [],
      summaries: [],
      categorySelected: false
    };
  },
  methods: {
    // Méthodes de l'application originale
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
      this.categorySelected = false;
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
        this.statusMessages = [];
        this.summaries = categorySummaries;
      }, 2000);
    },

    // Méthodes du paywall
    async checkPaymentStatus() {
      try {
        const hasPaid = localStorage.getItem('has_paid') === 'true';
        if (hasPaid) {
          this.hasPaid = true;
          await this.fetchCategories(); // Important: charger les catégories après vérification du paiement
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
      } finally {
        this.isLoading = false;
      }
    },

    handleWalletReady(ready) {
      this.walletReady = ready;
    },

    closePaywall() {
      this.showPaywall = false;
    },

    async handlePaymentSuccess() {
      console.log('Paiement reçu !');
      localStorage.setItem('has_paid', 'true');
      this.hasPaid = true;
      this.showPaywall = false;
      await this.fetchCategories(); // Important: charger les catégories après paiement réussi
    }
  },
  async mounted() {
    await this.checkPaymentStatus();
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

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  text-align: center;
}

/* Logo et Titre */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.title {
  flex: 0 0 10vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
}

/* Loader */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Paywall Styles */
.paywall-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-message {
  text-align: center;
  margin: 4rem 0;
}

.welcome-message h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.welcome-message p {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

/* Buttons */
.pay-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.pay-button:hover {
  background-color: #2980b9;
}

.pay-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

/* Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .paywall-container {
    padding: 1rem;
    margin: 1rem;
  }

  .welcome-message {
    margin: 2rem 0;
  }

  .welcome-message h1 {
    font-size: 1.5rem;
  }

  .pay-button {
    padding: 0.8rem 1.6rem;
    font-size: 1rem;
  }
}

/* Content Container Styles */
.content-container {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Status Messages */
.status-message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
  color: #2c3e50;
}

/* Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

/* Utils */
.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.hidden {
  display: none;
}
</style>