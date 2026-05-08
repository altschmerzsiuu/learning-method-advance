// src/lib/toast.js
export const toastEmitter = new EventTarget();

export const toast = {
  success: (message) => {
    toastEmitter.dispatchEvent(new CustomEvent('toast', { 
      detail: { message, type: 'success' } 
    }));
  },
  error: (message) => {
    toastEmitter.dispatchEvent(new CustomEvent('toast', { 
      detail: { message, type: 'error' } 
    }));
  },
  info: (message) => {
    toastEmitter.dispatchEvent(new CustomEvent('toast', { 
      detail: { message, type: 'info' } 
    }));
  }
};
