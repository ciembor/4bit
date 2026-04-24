import { useSchemeStore } from '../stores/Scheme';
import { createDefaultScheme } from './SchemeState';
import {
  clampHueDistance,
  degreesForHueSet,
  inferHueSetFromDegrees,
  isHueSetValue,
  normalizeHueSetValue,
} from './HueSetPresets';

const DYE_SCOPE_VALUES = Object.freeze(['none', 'all', 'achromatic', 'color']);
const SPECIAL_COLOR_VALUES = Object.freeze(['custom', 'black', 'bright_black', 'white', 'bright_white']);
const SCHEME_QUERY_KEYS = Object.freeze([
  'hue',
  'hueSet',
  'hueDistance',
  'degrees',
  'saturation',
  'saturationRange',
  'chromaticLightness',
  'lightnessRange',
  'blackLightness',
  'whiteLightness',
  'dyeScope',
  'dyeColor',
  'background',
  'customBackgroundColor',
  'foreground',
  'customForegroundColor',
]);
export const SCHEME_STORAGE_KEY = '4bit:scheme-search';
const LIGHTNESS_STEP = 25 / 64;
const QUANTIZE_EPSILON = 1e-9;

function browserWindow() {
  return typeof window !== 'undefined' ? window : null;
}

function browserLocation() {
  return browserWindow()?.location ?? {
    pathname: '',
    search: '',
    hash: '',
  };
}

function browserHistory() {
  return browserWindow()?.history ?? {
    state: null,
    replaceState: () => {},
  };
}

function browserStorage() {
  return browserWindow()?.localStorage ?? null;
}

function normalizeSearch(search = '') {
  if (!search) {
    return '';
  }

  return search.startsWith('?') ? search : `?${search}`;
}

function searchParamsFor(search = '') {
  const normalizedSearch = normalizeSearch(search);
  return new URLSearchParams(normalizedSearch ? normalizedSearch.slice(1) : '');
}

function serializeSearchParams(params) {
  return Array.from(params.entries())
    .map(([key, value]) => (
      `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(/%2C/gi, ',')}`
    ))
    .join('&');
}

function safelyReadPersistedSearch(storage) {
  try {
    return normalizeSearch(storage?.getItem(SCHEME_STORAGE_KEY) || '');
  } catch {
    return '';
  }
}

function safelyWritePersistedSearch(storage, search) {
  try {
    storage?.setItem(SCHEME_STORAGE_KEY, normalizeSearch(search));
  } catch {
    // Ignore storage failures; URL sync should still work without persistence.
  }
}

function hasSchemeQueryParams(search = '') {
  const params = searchParamsFor(search);
  return SCHEME_QUERY_KEYS.some((key) => params.has(key));
}

function mergeSchemeSearch(currentSearch = '', schemeSearch = '') {
  const params = searchParamsFor(currentSearch);
  const schemeParams = searchParamsFor(schemeSearch);

  SCHEME_QUERY_KEYS.forEach((key) => params.delete(key));
  schemeParams.forEach((value, key) => {
    params.set(key, value);
  });

  const mergedSearch = serializeSearchParams(params);
  return mergedSearch ? `?${mergedSearch}` : '';
}

export function resolveInitialSchemeSearch(currentSearch = '', storage = browserStorage()) {
  const normalizedCurrentSearch = normalizeSearch(currentSearch);

  if (hasSchemeQueryParams(normalizedCurrentSearch)) {
    return normalizedCurrentSearch;
  }

  const persistedSearch = safelyReadPersistedSearch(storage);

  if (!persistedSearch) {
    return normalizedCurrentSearch;
  }

  return mergeSchemeSearch(normalizedCurrentSearch, persistedSearch);
}

function replaceLocationSearch(nextSearch, location, history) {
  const normalizedSearch = normalizeSearch(nextSearch);
  const currentSearch = normalizeSearch(location.search);
  const nextUrl = `${location.pathname}${normalizedSearch}${location.hash}`;
  const currentUrl = `${location.pathname}${currentSearch}${location.hash}`;

  if (nextUrl !== currentUrl) {
    history.replaceState(history.state, '', nextUrl);
  }
}

function parseNumber(value) {
  if (value === null || value === '') {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function parseNumberList(value, expectedLength) {
  const entries = String(value)
    .split(',')
    .map((entry) => parseNumber(entry));

  return entries.length === expectedLength && entries.every((entry) => entry !== null)
    ? entries
    : null;
}

function sameValue(first, second) {
  if (Array.isArray(first) && Array.isArray(second)) {
    return (
      first.length === second.length &&
      first.every((entry, index) => entry === second[index])
    );
  }

  if (
    first &&
    second &&
    typeof first === 'object' &&
    typeof second === 'object'
  ) {
    const firstKeys = Object.keys(first);
    const secondKeys = Object.keys(second);

    return (
      firstKeys.length === secondKeys.length &&
      firstKeys.every((key) => first[key] === second[key])
    );
  }

  return first === second;
}

function serializeRoundedNumber(value, maxDecimals) {
  const roundedValue = Number(value.toFixed(maxDecimals));

  if (Object.is(roundedValue, -0)) {
    return '0';
  }

  return String(roundedValue);
}

function serializeQuantizedNumber(value, { step, maxDecimals }) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  const quantizedValue = Math.round(numericValue / step) * step;

  if (Math.abs(numericValue - quantizedValue) <= QUANTIZE_EPSILON) {
    return serializeRoundedNumber(quantizedValue, maxDecimals);
  }

  return String(numericValue);
}

function serializeIntegerLike(value) {
  return serializeQuantizedNumber(value, { step: 1, maxDecimals: 0 });
}

function serializePickerNumber(value) {
  return serializeQuantizedNumber(value, { step: 0.01, maxDecimals: 2 });
}

function serializeLightnessValue(value) {
  return serializeQuantizedNumber(value, { step: LIGHTNESS_STEP, maxDecimals: 6 });
}

function serializeSchemeQueryValue(key, value) {
  switch (key) {
    case 'hue':
    case 'hueDistance':
    case 'degrees':
    case 'saturation':
    case 'saturationRange':
    case 'lightnessRange':
      return Array.isArray(value)
        ? value.map(serializeIntegerLike).join(',')
        : serializeIntegerLike(value);
    case 'chromaticLightness':
    case 'blackLightness':
    case 'whiteLightness':
      return value.map(serializeLightnessValue).join(',');
    case 'dyeColor':
      return [
        serializeIntegerLike(value[0]),
        serializePickerNumber(value[1]),
        serializePickerNumber(value[2]),
        serializePickerNumber(value[3]),
      ].join(',');
    case 'customBackgroundColor':
    case 'customForegroundColor':
      return [
        serializeIntegerLike(value[0]),
        serializePickerNumber(value[1]),
        serializePickerNumber(value[2]),
      ].join(',');
    default:
      return Array.isArray(value) ? value.join(',') : String(value);
  }
}

function setParamIfChanged(params, key, value, defaultValue) {
  if (!sameValue(value, defaultValue)) {
    params.set(key, serializeSchemeQueryValue(key, value));
  }
}

function resolvedHueSet(scheme) {
  if (isHueSetValue(scheme.hueSet)) {
    const presetDegrees = degreesForHueSet(scheme.hueSet, scheme.hueDistance);
    const normalizedHueSet = normalizeHueSetValue(scheme.hueSet);

    if (presetDegrees && sameValue(scheme.degrees, presetDegrees)) {
      return normalizedHueSet;
    }
  }

  return inferHueSetFromDegrees(scheme.degrees, scheme.hueDistance);
}

function applyPresetDegreesIfMissing(scheme, hasDegreesParam) {
  if (hasDegreesParam) {
    return;
  }

  const presetDegrees = degreesForHueSet(scheme.hueSet, scheme.hueDistance);

  if (presetDegrees) {
    scheme.degrees = presetDegrees;
  }
}

function normalizeHueSet(scheme) {
  const inferredHueSet = inferHueSetFromDegrees(scheme.degrees, scheme.hueDistance);

  if (inferredHueSet) {
    scheme.hueSet = inferredHueSet;
    return;
  }

  scheme.hueSet = 'custom';
}

export function readSchemeFromSearch(search = '') {
  const scheme = createDefaultScheme();
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

  const parsedHue = parseNumber(params.get('hue'));
  if (parsedHue !== null) {
    scheme.hue = parsedHue;
  }

  const hueSet = params.get('hueSet');
  const normalizedHueSet = normalizeHueSetValue(hueSet);
  if (normalizedHueSet) {
    scheme.hueSet = normalizedHueSet;
  }

  if (params.has('hueDistance')) {
    scheme.hueDistance = clampHueDistance(params.get('hueDistance'));
  }

  const degrees = parseNumberList(params.get('degrees'), 6);
  const hasDegreesParam = params.has('degrees') && degrees !== null;
  if (degrees) {
    scheme.degrees = degrees;
  }

  const parsedSaturation = parseNumber(params.get('saturation'));
  if (parsedSaturation !== null) {
    scheme.saturation = parsedSaturation;
  }

  const parsedSaturationRange = parseNumber(params.get('saturationRange'));
  if (parsedSaturationRange !== null) {
    scheme.saturationRange = parsedSaturationRange;
  }

  const chromaticLightness = parseNumberList(params.get('chromaticLightness'), 2);
  if (chromaticLightness) {
    [scheme.normalChromaticLightness, scheme.brightChromaticLightness] = chromaticLightness;
  }

  const parsedLightnessRange = parseNumber(params.get('lightnessRange'));
  if (parsedLightnessRange !== null) {
    scheme.lightnessRange = parsedLightnessRange;
  }

  const blackLightness = parseNumberList(params.get('blackLightness'), 2);
  if (blackLightness) {
    [scheme.normalBlackLightness, scheme.brightBlackLightness] = blackLightness;
  }

  const whiteLightness = parseNumberList(params.get('whiteLightness'), 2);
  if (whiteLightness) {
    [scheme.normalWhiteLightness, scheme.brightWhiteLightness] = whiteLightness;
  }

  const dyeScope = params.get('dyeScope');
  if (DYE_SCOPE_VALUES.includes(dyeScope)) {
    scheme.dyeScope = dyeScope;
  }

  const dyeColor = parseNumberList(params.get('dyeColor'), 4);
  if (dyeColor) {
    [scheme.dyeColor.hue, scheme.dyeColor.saturation, scheme.dyeColor.lightness, scheme.dyeColor.alpha] = dyeColor;
  }

  const background = params.get('background');
  if (SPECIAL_COLOR_VALUES.includes(background)) {
    scheme.background = background;
  }

  const customBackgroundColor = parseNumberList(params.get('customBackgroundColor'), 3);
  if (customBackgroundColor) {
    [
      scheme.customBackgroundColor.hue,
      scheme.customBackgroundColor.saturation,
      scheme.customBackgroundColor.lightness,
    ] = customBackgroundColor;
  }

  const foreground = params.get('foreground');
  if (SPECIAL_COLOR_VALUES.includes(foreground)) {
    scheme.foreground = foreground;
  }

  const customForegroundColor = parseNumberList(params.get('customForegroundColor'), 3);
  if (customForegroundColor) {
    [
      scheme.customForegroundColor.hue,
      scheme.customForegroundColor.saturation,
      scheme.customForegroundColor.lightness,
    ] = customForegroundColor;
  }

  applyPresetDegreesIfMissing(scheme, hasDegreesParam);
  normalizeHueSet(scheme);

  return scheme;
}

export function buildSchemeQueryParams(scheme) {
  const params = new URLSearchParams();
  const defaults = createDefaultScheme();
  const hueSet = resolvedHueSet(scheme);

  setParamIfChanged(params, 'hue', scheme.hue, defaults.hue);
  if (hueSet && hueSet !== defaults.hueSet) {
    params.set('hueSet', hueSet);
  }
  setParamIfChanged(params, 'hueDistance', scheme.hueDistance, defaults.hueDistance);
  setParamIfChanged(params, 'degrees', scheme.degrees, defaults.degrees);
  setParamIfChanged(params, 'saturation', scheme.saturation, defaults.saturation);
  setParamIfChanged(params, 'saturationRange', scheme.saturationRange, defaults.saturationRange);
  setParamIfChanged(
    params,
    'chromaticLightness',
    [scheme.normalChromaticLightness, scheme.brightChromaticLightness],
    [defaults.normalChromaticLightness, defaults.brightChromaticLightness]
  );
  setParamIfChanged(params, 'lightnessRange', scheme.lightnessRange, defaults.lightnessRange);
  setParamIfChanged(
    params,
    'blackLightness',
    [scheme.normalBlackLightness, scheme.brightBlackLightness],
    [defaults.normalBlackLightness, defaults.brightBlackLightness]
  );
  setParamIfChanged(
    params,
    'whiteLightness',
    [scheme.normalWhiteLightness, scheme.brightWhiteLightness],
    [defaults.normalWhiteLightness, defaults.brightWhiteLightness]
  );
  setParamIfChanged(params, 'dyeScope', scheme.dyeScope, defaults.dyeScope);
  setParamIfChanged(
    params,
    'dyeColor',
    [
      scheme.dyeColor.hue,
      scheme.dyeColor.saturation,
      scheme.dyeColor.lightness,
      scheme.dyeColor.alpha,
    ],
    [
      defaults.dyeColor.hue,
      defaults.dyeColor.saturation,
      defaults.dyeColor.lightness,
      defaults.dyeColor.alpha,
    ]
  );
  setParamIfChanged(params, 'background', scheme.background, defaults.background);
  setParamIfChanged(
    params,
    'customBackgroundColor',
    [
      scheme.customBackgroundColor.hue,
      scheme.customBackgroundColor.saturation,
      scheme.customBackgroundColor.lightness,
    ],
    [
      defaults.customBackgroundColor.hue,
      defaults.customBackgroundColor.saturation,
      defaults.customBackgroundColor.lightness,
    ]
  );
  setParamIfChanged(params, 'foreground', scheme.foreground, defaults.foreground);
  setParamIfChanged(
    params,
    'customForegroundColor',
    [
      scheme.customForegroundColor.hue,
      scheme.customForegroundColor.saturation,
      scheme.customForegroundColor.lightness,
    ],
    [
      defaults.customForegroundColor.hue,
      defaults.customForegroundColor.saturation,
      defaults.customForegroundColor.lightness,
    ]
  );

  return params;
}

export function buildSchemeSearch(scheme) {
  const params = serializeSearchParams(buildSchemeQueryParams(scheme));
  return params ? `?${params}` : '';
}

export function hydrateSchemeStoreFromLocation(pinia, options = browserLocation().search) {
  const settings = typeof options === 'string'
    ? { search: options }
    : options;
  const {
    search = browserLocation().search,
    storage = browserStorage(),
    location = browserLocation(),
    history = browserHistory(),
  } = settings;
  const resolvedSearch = resolveInitialSchemeSearch(search, storage);
  const schemeStore = useSchemeStore(pinia);
  schemeStore.scheme = readSchemeFromSearch(resolvedSearch);

  replaceLocationSearch(resolvedSearch, location, history);

  return schemeStore;
}

export class SchemeUrlSync {
  constructor({
    schemeStore = useSchemeStore(),
    location = browserLocation(),
    history = browserHistory(),
    storage = browserStorage(),
  } = {}) {
    this.schemeStore = schemeStore;
    this.location = location;
    this.history = history;
    this.storage = storage;
    this.stopWatcher = null;
  }

  start(watch) {
    this.stopWatcher = watch(
      () => this.schemeStore.scheme,
      (scheme) => {
        this.updateLocation(scheme);
      },
      { deep: true, immediate: true }
    );

    return this.stopWatcher;
  }

  stop() {
    this.stopWatcher?.();
    this.stopWatcher = null;
  }

  updateLocation(scheme) {
    safelyWritePersistedSearch(this.storage, buildSchemeSearch(scheme));
    const currentParams = new URLSearchParams(this.location.search);
    SCHEME_QUERY_KEYS.forEach((key) => currentParams.delete(key));

    buildSchemeQueryParams(scheme).forEach((value, key) => {
      currentParams.set(key, value);
    });

    const nextSearch = serializeSearchParams(currentParams);
    const nextUrl = `${this.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${this.location.hash}`;
    const currentUrl = `${this.location.pathname}${this.location.search}${this.location.hash}`;

    if (nextUrl !== currentUrl) {
      this.history.replaceState(this.history.state, '', nextUrl);
    }
  }
}
