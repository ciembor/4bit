import { defineStore } from 'pinia';
import { ACHROMATIC_COLOR_NAMES } from '../constants';
import { CHROMATIC_COLOR_NAMES } from '../constants';
import { SPECIAL_COLOR_NAMES } from '../constants';

export const useCalculatedSchemeStore = defineStore('calculatedScheme', {
  state: () => ({
    calculatedScheme: Object.fromEntries(
      [...ACHROMATIC_COLOR_NAMES, ...CHROMATIC_COLOR_NAMES, ...SPECIAL_COLOR_NAMES].map(colorName => [colorName, null])
    )
  })
})
