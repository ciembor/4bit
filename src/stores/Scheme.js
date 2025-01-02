import { defineStore } from 'pinia';
import Color from 'color';

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    scheme: {
      hue: null,              // [0-360]
      saturation: null,       // [0-100]
      normalLightness: null,  // [0-100]
      brightLightness: null,  // [0-100]
      black: [],              // [Color, Color]
      white: [],              // [Color, Color]
      background: null,       // Color
      foreground: null,       // Color
      degrees: [],            // [int, int, int, int, int, int]
      colors: {},             // {colorName: Color, ..}
    }
  }),
  actions: {
    initialize() {
      this.scheme.hue = -15;
      this.scheme.saturation = 50;
      this.scheme.normalLightness = 50;
      this.scheme.brightLightness = 75;
      this.scheme.black = [
        Color({ h: 0, s: 0, l: 0 }),
        Color({ h: 0, s: 0, l: 50 * 0.25 })
      ];
      this.scheme.white = [
        Color({ h: 0, s: 0, l: 50 + 50 * 0.75 }),
        Color({ h: 0, s: 0, l: 100 })
      ];
      this.scheme.background = Color({ h: 0, s: 0, l: 0 });
      this.scheme.foreground = Color({ h: 0, s: 0, l: 50 + 50 * 0.75 });
      this.scheme.degrees = [0, 60, 120, 180, 240, 300];

      this.recalculateColors();
    },
    recalculateColors() {
      const { hue, saturation, normalLightness, brightLightness, degrees } = this.scheme;
    
      const normalArray = degrees.map(degree =>
        Color({ h: (hue + degree) % 360, s: saturation, l: normalLightness })
      );
      const brightArray = degrees.map(degree =>
        Color({ h: (hue + degree) % 360, s: saturation, l: brightLightness })
      );
    
      this.scheme.colors = {
        background: this.scheme.background,
        foreground: this.scheme.foreground,
        black: this.scheme.black[0],
        brightBlack: this.scheme.black[1],
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
        brightCyan: brightArray[3],
        white: this.scheme.white[0],
        brightWhite: this.scheme.white[1]
      };
    }
  }
});