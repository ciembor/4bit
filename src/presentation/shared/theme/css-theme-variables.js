import { COLOR_NAMES, SPECIAL_COLOR_NAMES } from '../../../domain/scheme/color-names';

function cssVariableName(colorName) {
  return `--color-${colorName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

export function applyThemeVariables(colors, themeRoot = document.body) {
  [...COLOR_NAMES, ...SPECIAL_COLOR_NAMES].forEach((colorName) => {
    const color = colors[colorName];
    const variableName = cssVariableName(colorName);

    if (color) {
      themeRoot.style.setProperty(variableName, color.hex());
    } else {
      themeRoot.style.removeProperty(variableName);
    }
  });
}

export function clearThemeVariables(themeRoot = document.body) {
  [...COLOR_NAMES, ...SPECIAL_COLOR_NAMES].forEach((colorName) => {
    themeRoot.style.removeProperty(cssVariableName(colorName));
  });
}
