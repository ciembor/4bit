import { defineStore } from 'pinia';
import { ACHROMATIC_COLOR_NAMES } from '../../domain/scheme/color-names';
import { CHROMATIC_COLOR_NAMES } from '../../domain/scheme/color-names';
import { SPECIAL_COLOR_NAMES } from '../../domain/scheme/color-names';

export const useCalculatedSchemeStore = defineStore('calculatedScheme', {
  state: () => ({
    calculatedScheme: Object.fromEntries(
      [...ACHROMATIC_COLOR_NAMES, ...CHROMATIC_COLOR_NAMES, ...SPECIAL_COLOR_NAMES].map(colorName => [colorName, null])
    )
  })
})
