// src/components/LightningPaywall.vue
<template>
  <div v-if="show" class="paywall-overlay">
    <div class="paywall-modal">
      <h2>Contenu Premium</h2>
      
      <LightningWallet @wallet-ready="walletReady = true" />
      
      <div v-if="walletReady">
        <p>Pour accéder à ce contenu, veuillez payer 1 sat</p>
        
        <div v-if="invoice" class="invoice-container">
          <p>Facture Lightning :</p>
          <div class="invoice-text">{{ invoice.payment_request }}</div>
          <button @click="copyInvoice" class="copy-btn">
            Copier la facture
          </button>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
        
        <div class="button-container">
          <button @click="createInvoice" :disabled="loading || invoice" class="pay-btn">
            {{ loading ? 'Chargement...' : 'Générer la facture' }}
          </button>
          
          <!-- Bouton de simulation en mode développement -->
          <button 
            v-if="isDevelopment && invoice"
            @click="simulatePayment" 
            class="simulate-btn"
          >
            Simuler le paiement
          </button>

          <button @click="$emit('close')" class="cancel-btn">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LightningWallet from './LightningWallet.vue'

// Configuration en dur pour éviter les erreurs
const API_CONFIG = {
  API_URL: process.env.VUE_APP_LNBITS_API_URL || 'https://demo.lnbits.com',
  INVOICE_KEY: process.env.VUE_APP_LNBITS_INVOICE_KEY,
  MIN_SATS: 1
}

export default {
  name: 'LightningPaywall',
  components: {
    LightningWallet
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      walletReady: false,
      invoice: null,
      loading: false,
      error: null,
      checkInterval: null,
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    async createInvoice() {
      this.loading = true;
      this.error = null;
      
      try {
        // En mode développement, créer une fausse facture
        if (this.isDevelopment) {
          this.invoice = {
            payment_hash: 'test_hash_' + Date.now(),
            payment_request: 'FACTURE_TEST_' + Date.now(),
          };
          return;
        }

        const response = await fetch(`${API_CONFIG.API_URL}/api/v1/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': API_CONFIG.INVOICE_KEY
          },
          body: JSON.stringify({
            out: false,
            amount: API_CONFIG.MIN_SATS,
            memo: "Accès contenu premium",
            unit: "sat"
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        this.invoice = data;
        this.startCheckingPayment();
      } catch (err) {
        this.error = "Erreur lors de la création de la facture";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // Nouvelle méthode pour simuler un paiement
    simulatePayment() {
      console.log('Simulation du paiement...');
      this.stopCheckingPayment();
      localStorage.setItem('has_paid', 'true');
      this.$emit('payment-success');
      this.$emit('close');
    },

    async checkPayment() {
      if (!this.invoice) return;
      
      // En mode développement, ne pas vérifier réellement le paiement
      if (this.isDevelopment) return;
      
      try {
        const response = await fetch(
          `${API_CONFIG.API_URL}/api/v1/payments/${this.invoice.payment_hash}`,
          {
            headers: {
              'X-Api-Key': API_CONFIG.INVOICE_KEY
            }
          }
        );
        
        const data = await response.json();
        if (data.paid) {
          this.stopCheckingPayment();
          localStorage.setItem('has_paid', 'true');
          this.$emit('payment-success');
          this.$emit('close');
        }
      } catch (err) {
        console.error('Erreur vérification paiement:', err);
      }
    },

    startCheckingPayment() {
      if (!this.isDevelopment) {
        this.checkInterval = setInterval(this.checkPayment, 2000);
      }
    },

    stopCheckingPayment() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    },

    copyInvoice() {
      if (this.invoice) {
        navigator.clipboard.writeText(this.invoice.payment_request);
      }
    }
  },

  beforeUnmount() {
    this.stopCheckingPayment();
  }
}
</script>


<style scoped>
.paywall-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.paywall-modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.invoice-container {
  margin: 1rem 0;
}

.invoice-text {
  word-break: break-all;
  background-color: #f5f5f5;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  font-family: monospace;
}

.button-container {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.pay-btn, .copy-btn, .cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.pay-btn {
  background-color: #28a745;
  color: white;
}

.copy-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.error {
  color: #dc3545;
  margin: 0.5rem 0;
}
</style>