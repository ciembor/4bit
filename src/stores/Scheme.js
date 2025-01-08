import { defineStore } from 'pinia';

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    scheme: {
      // chromatic
      hue: -15,                               // int [0-360]
      degrees: [0, 60, 120, 180, 240, 300],   // [int, int, int, int, int, int]
      saturation: 50,                         // float [0-100]
      normalChromaticLightness: 50,           // float [0-100]
      brightChromaticLightness: 75,           // float [0-100]
      // achromatic
      normalBlackLightness: 0,                // float [0-100]
      brightBlackLightness: 12.5,             // float [0-100]
      normalWhiteLightness: 87.5,             // float [0-100]
      brightWhiteLightness: 100,              // float [0-100]
      // special
      dyeScope: null,                         // enum (null, 'all', 'achromatic', 'chromatic')
      dyeColor: null,                         // HSLA Color
      background: null,                       // enum ('custom', 'black', 'brightBlack', 'white', 'brightWhite')
      customBackgroundColor: null,            // HSL Color
      foreground: null,                       // enum ('custom', 'black', 'brightBlack', 'white', 'brightWhite')
      customForegroundColor: null             // HSL Color
    }
  })
});