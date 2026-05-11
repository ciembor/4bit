import { calculateSchemeColors } from '../../domain/scheme/color-scheme-calculator';
import { SCHEME_STORAGE_KEY } from '../../infrastructure/browser/scheme-storage-key';
import { readSchemeFromSearch } from '../../infrastructure/url/scheme-query';
import { useCalculatedSchemeStore } from '../shared/stores/calculated-scheme';
import { useSchemeStore } from '../shared/stores/scheme';
import { applyThemeVariables } from '../shared/theme/css-theme-variables';

function readPersistedSchemeSearch() {
  try {
    return window.localStorage.getItem(SCHEME_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function initializeAboutPageTheme(pinia) {
  const scheme = readSchemeFromSearch(readPersistedSchemeSearch());
  const colors = calculateSchemeColors(scheme);

  useSchemeStore(pinia).replaceScheme(scheme);
  useCalculatedSchemeStore(pinia).calculatedScheme = colors;
  applyThemeVariables(colors);
}
