import { watch } from 'vue';
import { useCalculatedSchemeStore } from '../stores/CalculatedScheme';
import { COLOR_NAMES } from '../constants';

class DynamicStyle {
  constructor() {
    this.calculatedSchemeStore = useCalculatedSchemeStore();
    this.stylesheetId = 'dynamic-styles';
    this.stylesheet = null;
    this.storeWatcher = null;

    this.observeStore();
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
    rules.push(`#footer p:hover .footer-link { color: ${colors.blue?.hex()}; }`);
    rules.push(`#footer p:hover .footer-link:visited { color: ${colors.magenta?.hex()}; }`);

    colorNames.forEach((name) => {
      if (colors[name]) {
        rules.push(`.${name} { color: ${colors[name]?.hex()}; }`);
        rules.push(`.${name}Bg { background-color: ${colors[name]?.hex()}; }`);
      }
    });

    return rules;
  }

  observeStore() {
    if (!this.storeWatcher) {
      this.storeWatcher = watch(
        () => this.calculatedSchemeStore.calculatedScheme,
        (calculatedScheme) => {
          const rules = this.generateRules(calculatedScheme, COLOR_NAMES);
          this.setRules(rules);
        },
        { immediate: true }
      );
    }
  }
}

export default DynamicStyle;
