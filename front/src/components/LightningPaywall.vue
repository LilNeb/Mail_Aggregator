// src/components/LightningPaywall.vue
<template>
  <div v-if="show" class="paywall-overlay">
    <div class="paywall-modal">
      <h2>Contenu Premium</h2>
      <p>Pour accéder à ce contenu, veuillez payer 1 sat</p>
      
      <div v-if="invoice" class="qr-container">
        <p>Scannez le QR code ou copiez l'invoice:</p>
        <div class="invoice-text">{{ invoice.request }}</div>
        <button @click="copyInvoice">Copier l'invoice</button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      
      <div class="button-container">
        <button @click="getInvoice" :disabled="loading || invoice">
          {{ loading ? 'Chargement...' : 'Payer maintenant' }}
        </button>
        <button @click="$emit('close')" class="cancel-btn">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000'; // Ajustez selon votre configuration

export default {
  name: 'LightningPaywall',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      invoice: null,
      loading: false,
      error: null,
      checkInterval: null
    }
  },
  methods: {
    async getInvoice() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${API_URL}/lightning/invoice`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        
        this.invoice = data;
        this.startCheckingPayment();
      } catch (err) {
        this.error = "Erreur lors de la création de l'invoice";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async checkPayment() {
      try {
        const response = await fetch(
          `${API_URL}/lightning/check-invoice?hash=${this.invoice.hash}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        const data = await response.json();
        if (data.paid) {
          this.stopCheckingPayment();
          this.$emit('payment-success');
          this.$emit('close');
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du paiement:', err);
      }
    },

    startCheckingPayment() {
      this.checkInterval = setInterval(this.checkPayment, 2000);
    },

    stopCheckingPayment() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    },

    copyInvoice() {
      if (this.invoice) {
        navigator.clipboard.writeText(this.invoice.request);
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

.invoice-text {
  word-break: break-all;
  background-color: #f5f5f5;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.button-container {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
}

.error {
  color: red;
  margin: 1rem 0;
}
</style>