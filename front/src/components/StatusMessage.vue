<template>
    <div class="status-messages" v-if="messages.length">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      messages: {
        type: Array,
        default: () => []
      }
    }
  };
  </script>
  
  <style scoped>
  .status-messages {
    padding: 20px;
    background-color: #0d0d0d;
    color: #00ff00;
    border-radius: 5px;
    margin: 20px;
    text-align: left;
    overflow-y: auto;
    max-height: 80vh;
    font-family: 'Courier New', Courier, monospace;
    white-space: pre;
  }
  
  .message {
    margin-bottom: 10px;
  }
  </style>
  