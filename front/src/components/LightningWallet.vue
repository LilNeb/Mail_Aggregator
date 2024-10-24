// src/components/LightningWallet.vue

<template>
  <div class="wallet-container">
    <div v-if="!initialized && !error" class="wallet-status">
      <p>Initialisation du wallet...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryInitialization" class="retry-btn">
        Réessayer
      </button>
    </div>
    <div v-else class="wallet-status">
      <p>Wallet connecté à LNBits</p>
      <p class="wallet-balance" v-if="balance !== null">
        Solde: {{ balance }} sats
      </p>
    </div>
  </div>
</template>

<script>
import { LNBITS_CONFIG, createWalletConfig } from '../config/lightning';

export default {
  name: 'LightningWallet',
  data() {
    return {
      initialized: false,
      error: null,
      balance: null
    }
  },
  async mounted() {
    await this.initializeWallet();
  },
  methods: {
    async initializeWallet() {
      this.error = null;
      
      try {
        console.log('Début initialisation wallet...');
        const config = createWalletConfig();
        console.log('Configuration créée');

        const response = await fetch(`${LNBITS_CONFIG.API_URL}${LNBITS_CONFIG.ENDPOINTS.WALLET}`, {
          headers: config.adminHeaders
        });

        console.log('Réponse reçue:', response.status);
        
        if (!response.ok) {
          throw new Error(`Erreur de connexion au wallet (${response.status})`);
        }

        const data = await response.json();
        console.log('Données reçues:', data);
        
        this.balance = data.balance || 0;
        this.initialized = true;
        this.$emit('wallet-ready', true);
        
      } catch (err) {
        console.error('Erreur détaillée:', err);
        this.error = `Erreur d'initialisation: ${err.message}`;
        this.$emit('wallet-ready', false);
      }
    },
    
    async retryInitialization() {
      await this.initializeWallet();
    }
  }
}
</script>


<style scoped>
.wallet-container {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin: 1rem 0;
}

.wallet-status {
  text-align: center;
}

.error-message {
  color: #dc3545;
  text-align: center;
  padding: 1rem;
}

.retry-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.wallet-balance {
  font-weight: bold;
  color: #28a745;
}
</style>