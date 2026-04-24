import { useSchemeStore } from '../../presentation/stores/scheme';
import {
  buildSchemeQueryParams,
  buildSchemeSearch,
  readSchemeFromSearch,
  SCHEME_QUERY_KEYS,
  serializeSearchParams,
} from '../serialization/scheme-query';
export const SCHEME_STORAGE_KEY = '4bit:scheme-search';

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
  schemeStore.replaceScheme(readSchemeFromSearch(resolvedSearch));

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
