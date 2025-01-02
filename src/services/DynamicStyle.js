import { watch } from 'vue';
import { useSchemeStore } from '../stores/Scheme';
import { COLOR_NAMES } from '../constants';

class DynamicStyle {
  constructor() {
    this.stylesheetId = 'dynamic-styles';
    this.stylesheet = null;
    this.storeWatcher = null;
  }

  initializeStylesheet() {
    if (!this.stylesheet) {
      this.stylesheet = document.getElementById(this.stylesheetId);
      if (!this.stylesheet) {
        this.stylesheet = document.createElement('style');
        this.stylesheet.id = this.stylesheetId;
        document.head.appendChild(this.stylesheet);
      }
    }
  }

  setRules(rules) {
    this.initializeStylesheet();
    this.stylesheet.innerHTML = rules.join('\n');
  }

  generateRules(colors, colorNames) {
    const rules = [];
    rules.push(`#terminal-display { color: ${colors.foreground?.hex()}; background-color: ${colors.background?.hex()}; }`);

    colorNames.forEach((name) => {
      if (colors[name]) {
        rules.push(`.${name} { color: ${colors[name]?.hex()}; }`);
        rules.push(`.${name}Bg { background-color: ${colors[name]?.hex()}; }`);
      }
    });

    return rules;
  }

  observeStore() {
    const schemeStore = useSchemeStore();
    schemeStore.initialize();

    if (!this.storeWatcher) {
      this.storeWatcher = watch(
        () => schemeStore.scheme.colors,
        (colors) => {
          const rules = this.generateRules(colors, COLOR_NAMES);
          this.setRules(rules);
        },
        { deep: true, immediate: true }
      );
    }
  }
}

export default new DynamicStyle();