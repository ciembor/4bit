import { describe, expect, it, vi } from 'vitest';
import { createPinia } from 'pinia';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import {
  hydrateSchemeStoreFromLocation,
  resolveInitialSchemeSearch,
  SCHEME_STORAGE_KEY,
  SchemeUrlSync,
} from '../../../src/infrastructure/browser/scheme-url-sync';

describe('SchemeUrlSync', () => {
  it('preserves unrelated query params while updating scheme params', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 10;
    scheme.dyeScope = 'all';

    const location = {
      pathname: '/4bit/',
      search: '?utm_source=readme&hue=5',
      hash: '#preview',
    };
    const history = {
      state: { any: 'value' },
      replaceState: vi.fn(),
    };

    new SchemeUrlSync({
      schemeStore: { scheme },
      location,
      history,
    }).updateLocation(scheme);

    expect(history.replaceState).toHaveBeenCalledWith(
      history.state,
      '',
      '/4bit/?utm_source=readme&hue=10&dyeScope=all#preview'
    );
  });

  it('registers a deep immediate watcher and can stop it', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 10;
    const stopWatcher = vi.fn();
    const watch = vi.fn(() => stopWatcher);
    const sync = new SchemeUrlSync({
      schemeStore: { scheme },
      location: {
        pathname: '/4bit/',
        search: '',
        hash: '',
      },
      history: {
        state: null,
        replaceState: vi.fn(),
      },
    });

    const returnedStop = sync.start(watch);

    expect(watch).toHaveBeenCalledTimes(1);
    const [source, callback, options] = watch.mock.calls[0];
    expect(source()).toBe(scheme);
    expect(options).toEqual({ deep: true, immediate: true });
    callback(scheme);
    expect(sync.history.replaceState).toHaveBeenCalled();
    expect(returnedStop).toBe(stopWatcher);

    sync.stop();
    expect(stopWatcher).toHaveBeenCalledTimes(1);
    expect(sync.stopWatcher).toBeNull();
  });

  it('prefers explicit scheme params in the URL over persisted state', () => {
    const storage = {
      getItem: vi.fn(() => '?hue=45&dyeScope=all'),
    };

    expect(resolveInitialSchemeSearch('?hue=12', storage)).toBe('?hue=12');
  });

  it('returns the current search when persisted scheme params are unavailable', () => {
    expect(resolveInitialSchemeSearch('?utm_source=readme', null)).toBe('?utm_source=readme');
  });

  it('normalizes current search strings that omit the leading question mark', () => {
    expect(resolveInitialSchemeSearch('utm_source=readme', null)).toBe('?utm_source=readme');
  });

  it('ignores persisted search read errors and keeps the current URL search', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('storage unavailable');
      }),
    };

    expect(resolveInitialSchemeSearch('?utm_source=readme', storage)).toBe('?utm_source=readme');
  });

  it('falls back to persisted scheme params and preserves unrelated URL params', () => {
    const storage = {
      getItem: vi.fn(() => '?hue=45&dyeScope=all'),
    };

    expect(resolveInitialSchemeSearch('?utm_source=readme', storage))
      .toBe('?utm_source=readme&hue=45&dyeScope=all');
  });

  it('ignores persisted search values that do not contain any actual params', () => {
    const storage = {
      getItem: vi.fn(() => '?'),
    };

    expect(resolveInitialSchemeSearch('', storage)).toBe('');
  });

  it('hydrates the store from persisted search when the URL has no scheme params', () => {
    const pinia = createPinia();
    const storage = {
      getItem: vi.fn(() => '?hue=45&dyeScope=all'),
    };
    const location = {
      pathname: '/4bit/',
      search: '',
      hash: '#preview',
    };
    const history = {
      state: { from: 'test' },
      replaceState: vi.fn(),
    };

    const schemeStore = hydrateSchemeStoreFromLocation(pinia, {
      search: location.search,
      storage,
      location,
      history,
    });

    expect(schemeStore.scheme.hue).toBe(45);
    expect(schemeStore.scheme.dyeScope).toBe('all');
    expect(history.replaceState).toHaveBeenCalledWith(
      history.state,
      '',
      '/4bit/?hue=45&dyeScope=all#preview'
    );
  });

  it('hydrates from the string overload using browser fallbacks in non-browser tests', () => {
    const pinia = createPinia();

    const schemeStore = hydrateSchemeStoreFromLocation(pinia, '?hue=12&dyeScope=all');

    expect(schemeStore.scheme.hue).toBe(12);
    expect(schemeStore.scheme.dyeScope).toBe('all');
  });

  it('hydrates from global browser objects when options are omitted', () => {
    const pinia = createPinia();
    const originalWindow = globalThis.window;
    const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, 'window');
    const history = {
      state: { from: 'browser' },
      replaceState: vi.fn(),
    };

    globalThis.window = {
      location: {
        pathname: '/4bit/',
        search: '',
        hash: '#preview',
      },
      history,
      localStorage: {
        getItem: vi.fn(() => '?hue=33'),
      },
    };

    try {
      const schemeStore = hydrateSchemeStoreFromLocation(pinia);

      expect(schemeStore.scheme.hue).toBe(33);
      expect(history.replaceState).toHaveBeenCalledWith(
        history.state,
        '',
        '/4bit/?hue=33#preview'
      );
    } finally {
      if (hadWindow) {
        globalThis.window = originalWindow;
      } else {
        delete globalThis.window;
      }
    }
  });

  it('does not replace history during hydration when the URL already matches', () => {
    const pinia = createPinia();
    const history = {
      state: { from: 'test' },
      replaceState: vi.fn(),
    };
    const location = {
      pathname: '/4bit/',
      search: '?hue=12',
      hash: '#preview',
    };

    hydrateSchemeStoreFromLocation(pinia, {
      search: '?hue=12',
      storage: null,
      location,
      history,
    });

    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it('persists the current scheme search for future visits', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 10;
    scheme.dyeScope = 'all';

    const storage = {
      setItem: vi.fn(),
    };

    new SchemeUrlSync({
      schemeStore: { scheme },
      location: {
        pathname: '/4bit/',
        search: '',
        hash: '',
      },
      history: {
        state: null,
        replaceState: vi.fn(),
      },
      storage,
    }).updateLocation(scheme);

    expect(storage.setItem).toHaveBeenCalledWith(
      SCHEME_STORAGE_KEY,
      '?hue=10&dyeScope=all'
    );
  });

  it('ignores storage errors while keeping URL sync working', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 10;
    const history = {
      state: null,
      replaceState: vi.fn(),
    };

    new SchemeUrlSync({
      schemeStore: { scheme },
      location: {
        pathname: '/4bit/',
        search: '',
        hash: '',
      },
      history,
      storage: {
        setItem: vi.fn(() => {
          throw new Error('quota exceeded');
        }),
      },
    }).updateLocation(scheme);

    expect(history.replaceState).toHaveBeenCalledWith(
      history.state,
      '',
      '/4bit/?hue=10'
    );
  });

  it('does not replace history when the current URL already matches the scheme', () => {
    const scheme = createDefaultScheme();
    scheme.hue = 10;
    const history = {
      state: null,
      replaceState: vi.fn(),
    };

    new SchemeUrlSync({
      schemeStore: { scheme },
      location: {
        pathname: '/4bit/',
        search: '?hue=10',
        hash: '',
      },
      history,
      storage: null,
    }).updateLocation(scheme);

    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it('keeps the URL empty for the default scheme when no extra params are present', () => {
    const scheme = createDefaultScheme();
    const history = {
      state: null,
      replaceState: vi.fn(),
    };

    new SchemeUrlSync({
      schemeStore: { scheme },
      location: {
        pathname: '/4bit/',
        search: '',
        hash: '',
      },
      history,
      storage: null,
    }).updateLocation(scheme);

    expect(history.replaceState).not.toHaveBeenCalled();
  });
});
