import { watch } from 'vue';
import Color from 'color';
import { useSchemeStore } from '../stores/Scheme';
import { useCalculatedSchemeStore } from '../stores/CalculatedScheme';

class SchemeCalculator {
  constructor() {
    this.schemeStore = useSchemeStore();
    this.calculatedSchemeStore = useCalculatedSchemeStore();
    this.storeWatcher = null;

    this.observeStore();
  }

  calculateColors(scheme) {
    const {
      hue,
      saturation,
      normalChromaticLightness,
      brightChromaticLightness,
      degrees,
      normalBlackLightness,
      brightBlackLightness,
      normalWhiteLightness,
      brightWhiteLightness
    } = scheme;

    const normalArray = degrees.map(degree =>
      Color({ h: (hue + degree) % 360, s: saturation, l: normalChromaticLightness })
    );
    const brightArray = degrees.map(degree =>
      Color({ h: (hue + degree) % 360, s: saturation, l: brightChromaticLightness })
    );

    this.calculatedSchemeStore.calculatedScheme = {
      background: Color({ h: 0, s: 0, l: normalBlackLightness }),
      foreground: Color({ h: 0, s: 0, l: normalWhiteLightness }),
      black: Color({ h: 0, s: 0, l: normalBlackLightness }),
      brightBlack: Color({ h: 0, s: 0, l: brightBlackLightness }),
      white: Color({ h: 0, s: 0, l: normalWhiteLightness }),
      brightWhite: Color({ h: 0, s: 0, l: brightWhiteLightness }),
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

  observeStore() {
    this.storeWatcher = watch(
      () => this.schemeStore.scheme,
      (newScheme) => {
        if (newScheme) {
          this.calculateColors(newScheme);
        }
      },
      { immediate: true, deep: true } 
    );
  }
}

export default SchemeCalculator;