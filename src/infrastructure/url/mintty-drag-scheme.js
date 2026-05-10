import { paletteColorNames } from '../serialization/scheme-exports/shared';

// Mintty decodes this compact URL payload by position, so this order is part of
// the drag-and-drop contract.
export const MINTTY_DRAG_SCHEME_COLOR_ORDER = Object.freeze([
  'background',
  'foreground',
  'cursor',
  ...paletteColorNames(),
]);

const MINTTY_DRAG_SCHEME_REQUIRED_COLORS = Object.freeze([
  'background',
  'foreground',
  ...paletteColorNames(),
]);

function hasMinttyDragSchemeColors(colors) {
  return MINTTY_DRAG_SCHEME_REQUIRED_COLORS.every((name) => colors?.[name]);
}

function colorForName(colors, name) {
  if (name === 'cursor') {
    return colors.cursor || colors.foreground;
  }

  return colors[name];
}

function colorHexValue(color) {
  return color.hex().slice(1).toUpperCase();
}

export function serializeMinttyDragScheme(colors) {
  if (!hasMinttyDragSchemeColors(colors)) {
    return '';
  }

  return MINTTY_DRAG_SCHEME_COLOR_ORDER
    .map((name) => colorHexValue(colorForName(colors, name)))
    .join(':');
}

export function buildMinttyDragSchemeHash(colors) {
  const scheme = serializeMinttyDragScheme(colors);

  return scheme ? `#?scheme=${scheme}` : '';
}
