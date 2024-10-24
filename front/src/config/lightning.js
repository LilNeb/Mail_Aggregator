// src/config/lightning.js
export const LNBITS_CONFIG = {
    API_URL: process.env.VUE_APP_LNBITS_API_URL || 'https://demo.lnbits.com',
    ADMIN_KEY: process.env.VUE_APP_LNBITS_ADMIN_KEY || '',
    INVOICE_KEY: process.env.VUE_APP_LNBITS_INVOICE_KEY || '',
    MIN_SATS: 1,
    ENDPOINTS: {
        CREATE_INVOICE: '/api/v1/payments',
        CHECK_INVOICE: '/api/v1/payments',
        WALLET: '/api/v1/wallet',
        PAY_LINKS: '/api/v1/links' // Nouvel endpoint pour Pay Links
      }
  };
  
  export const createWalletConfig = () => {
    if (!LNBITS_CONFIG.ADMIN_KEY) {
      console.error('Admin key manquante');
      throw new Error('Configuration du wallet incomplète: Admin key manquante');
    }
    if (!LNBITS_CONFIG.INVOICE_KEY) {
      console.error('Invoice key manquante');
      throw new Error('Configuration du wallet incomplète: Invoice key manquante');
    }
  
    return {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': LNBITS_CONFIG.INVOICE_KEY
      },
      adminHeaders: {
        'Content-Type': 'application/json',
        'X-Api-Key': LNBITS_CONFIG.ADMIN_KEY
      }
    };
  };