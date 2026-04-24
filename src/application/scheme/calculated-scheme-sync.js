import { watch } from 'vue';
import { useSchemeStore } from '../../presentation/stores/scheme';
import { useCalculatedSchemeStore } from '../../presentation/stores/calculated-scheme';
import { calculateSchemeColors } from '../../domain/scheme/color-scheme-calculator';

class CalculatedSchemeSync {
  constructor({
    schemeStore = useSchemeStore(),
    calculatedSchemeStore = useCalculatedSchemeStore(),
  } = {}) {
    this.schemeStore = schemeStore;
    this.calculatedSchemeStore = calculatedSchemeStore;
    this.stopWatcher = null;

    this.start(watch);
  }

  updateCalculatedScheme(scheme) {
    this.calculatedSchemeStore.calculatedScheme = calculateSchemeColors(scheme);
  }

  start(watchFn = watch) {
    this.stop();
    this.stopWatcher = watchFn(
      () => this.schemeStore.scheme,
      (scheme) => {
        if (scheme) {
          this.updateCalculatedScheme(scheme);
        }
      },
      { immediate: true, deep: true }
    );

    return this.stopWatcher;
  }

  stop() {
    this.stopWatcher?.();
    this.stopWatcher = null;
  }
}

export default CalculatedSchemeSync;
