import { defineStore } from 'pinia';
import { createDefaultScheme } from '../services/SchemeState';

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    scheme: createDefaultScheme()
  })
});
