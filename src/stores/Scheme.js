import { defineStore } from 'pinia';

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    scheme: {
      // chromatic
      hue: -15,                               // int [0-360]
      hueSet: 'standard',                     // enum ('uno', 'duo', 'trio', 'standard')
      hueDistance: 0,                         // int [0-45]
      degrees: [0, 60, 120, 180, 240, 300],   // [int, int, int, int, int, int]
      saturation: 50,                         // float [0-100]
      saturationRange: 0,                     // int [0-50]
      normalChromaticLightness: 50,           // float [0-100]
      brightChromaticLightness: 75,           // float [0-100]
      lightnessRange: 0,                      // int [0-30]
      // achromatic
      normalBlackLightness: 0,                // float [0-100]
      brightBlackLightness: 12.5,             // float [0-100]
      normalWhiteLightness: 87.5,             // float [0-100]
      brightWhiteLightness: 100,              // float [0-100]
      // special
      dyeScope: 'none',                       // enum ('none', 'all', 'achromatic', 'color')
      dyeColor: {
        hue: 180,
        saturation: 50,
        lightness: 50,
        alpha: 0.25
      },
      background: 'black',                    // enum ('custom', 'black', 'bright_black', 'white', 'bright_white')
      customBackgroundColor: {
        hue: 180,
        saturation: 50,
        lightness: 10
      },
      foreground: 'white',                    // enum ('custom', 'black', 'bright_black', 'white', 'bright_white')
      customForegroundColor: {
        hue: 180,
        saturation: 50,
        lightness: 90
      }
    }
  })
});
