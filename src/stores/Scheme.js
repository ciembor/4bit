import { defineStore } from 'pinia';
import Color from 'color';

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    scheme: {
      // chromatic
      hue: null,                        // int [0-360]
      degrees: [],                      // [int, int, int, int, int, int]
      saturation: null,                 // float [0-100]
      normalChromaticLightness: null,   // float [0-100]
      brightChromaticLightness: null,   // float [0-100]
      // achromatic
      normalBlackLightness: null,       // float [0-100]
      brightBlackLightness: null,       // float [0-100]
      normalWhiteLightness: null,       // float [0-100]
      brightBlackLightness: null,       // float [0-100]
      // calculated
      colors: {},                       // {colorName: Color, ..}
    }
  }),
  actions: {
    initialize() {
      this.scheme.hue = -15;
      this.scheme.degrees = [0, 60, 120, 180, 240, 300];
      this.scheme.saturation = 50;
      this.scheme.normalChromaticLightness = 50;
      this.scheme.brightChromaticLightness = 75;
      this.scheme.normalBlackLightness = 0;
      this.scheme.brightBlackLightness = 12.5;
      this.scheme.normalWhiteLightness = 87.5;
      this.scheme.brightWhiteLightness = 100;

      this.recalculateColors();
    },
    recalculateColors() {
      const { hue, saturation, normalChromaticLightness, brightChromaticLightness, degrees } = this.scheme;
    
      const normalArray = degrees.map(degree =>
        Color({ h: (hue + degree) % 360, s: saturation, l: normalChromaticLightness })
      );
      const brightArray = degrees.map(degree =>
        Color({ h: (hue + degree) % 360, s: saturation, l: brightChromaticLightness })
      );
      const black = Color({ h: 0, s: 0, l: 0 });

      this.scheme.colors = {
        background: black.lightness(this.scheme.normalBlackLightness),
        foreground: black.lightness(this.scheme.normalWhiteLightness),
        black: black.lightness(this.scheme.normalBlackLightness),
        brightBlack: black.lightness(this.scheme.brightBlackLightness),
        white: black.lightness(this.scheme.normalWhiteLightness),
        brightWhite: black.lightness(this.scheme.brightWhiteLightness),
        red: normalArray[0],
        brightRed: brightArray[0],
        green: normalArray[2],
        brightGreen: brightArray[2],
        yellow: normalArray[1],
        brightYellow: brightArray[1],
        blue: normalArray[4],
        brightBlue: brightArray[4],
        magenta: normalArray[5],
        brightMagenta: brightArray[5],
        cyan: normalArray[3],
        brightCyan: brightArray[3]
      };
    }
  }
});