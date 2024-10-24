// src/App.vue
<template>
  <div id="app">
    <!-- Afficher le loader pendant la vérification -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- Afficher le contenu normal si l'utilisateur a payé -->
    <div v-else-if="hasPaid">
      <CategoryGrid />
      <SummariesContainer />
    </div>

    <!-- Afficher le paywall si l'utilisateur n'a pas payé -->
    <div v-else class="paywall-container">
      <div class="welcome-message">
        <h1>Bienvenue sur notre plateforme</h1>
        <p>Pour accéder à tous nos contenus, un paiement unique de 1 sat est requis.</p>
        
        <!-- Intégration du composant LightningWallet -->
        <LightningWallet 
          @wallet-ready="handleWalletReady"
        />
        
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
import { LNBITS_CONFIG } from './config/lightning'
import CategoryGrid from './components/CategoryGrid.vue'
import SummariesContainer from './components/SummariesContainer.vue'
import LightningWallet from './components/LightningWallet.vue'
import LightningPaywall from './components/LightningPaywall.vue'

export default {
  name: 'App',
  components: {
    CategoryGrid,
    SummariesContainer,
    LightningWallet,
    LightningPaywall
  },
  data() {
    return {
      isLoading: true,
      hasPaid: false,
      showPaywall: false,
      walletReady: false
    }
  },
  methods: {
    async checkPaymentStatus() {
      try {
        // Vérifier d'abord le localStorage
        const hasPaid = localStorage.getItem('has_paid') === 'true';
        if (hasPaid) {
          this.hasPaid = true;
          return;
        }

        // Si pas dans le localStorage, vérifier avec l'API
        if (LNBITS_CONFIG.INVOICE_KEY) {
          const response = await fetch(`${LNBITS_CONFIG.API_URL}/api/v1/payments`, {
            headers: {
              'X-Api-Key': LNBITS_CONFIG.INVOICE_KEY
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const hasPaidPayment = data.some(payment => payment.paid);
            if (hasPaidPayment) {
              localStorage.setItem('has_paid', 'true');
              this.hasPaid = true;
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    handleWalletReady(ready) {
      console.log('Wallet ready:', ready);
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
      await this.checkPaymentStatus();
    }
  },
  async mounted() {
    console.log('Variables d\'environnement :', {
      API_URL: process.env.VUE_APP_LNBITS_API_URL,
      hasAdminKey: !!process.env.VUE_APP_LNBITS_ADMIN_KEY,
      hasInvoiceKey: !!process.env.VUE_APP_LNBITS_INVOICE_KEY
    });
    
    await this.checkPaymentStatus();
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

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

.paywall-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-message {
  text-align: center;
  margin: 4rem 0;
}

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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>