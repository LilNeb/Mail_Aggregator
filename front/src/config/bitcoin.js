// src/config/bitcoin.js
export const BITCOIN_CONFIG = {
    // Configuration Signet
    NETWORK: 'signet',
    RPC_URL: 'http://127.0.0.1:38332', // Port standard pour Signet
    MIN_AMOUNT: 100, // En satoshis (0.000001 BTC)
    
    // Identifiants RPC (à mettre dans .env)
    RPC_USER: process.env.VUE_APP_BITCOIN_RPC_USER,
    RPC_PASSWORD: process.env.VUE_APP_BITCOIN_RPC_PASSWORD,
    
    // Adresse de réception (à remplacer par votre adresse Signet)
    RECEIVER_ADDRESS: process.env.VUE_APP_BITCOIN_RECEIVER_ADDRESS
  };
  
  export const createBitcoinHeaders = () => {
    const auth = btoa(`${BITCOIN_CONFIG.RPC_USER}:${BITCOIN_CONFIG.RPC_PASSWORD}`);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    };
  };