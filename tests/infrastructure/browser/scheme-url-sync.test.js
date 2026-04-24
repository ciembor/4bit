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

  it('falls back to persisted scheme params and preserves unrelated URL params', () => {
    const storage = {
      getItem: vi.fn(() => '?hue=45&dyeScope=all'),
    };

    expect(resolveInitialSchemeSearch('?utm_source=readme', storage))
      .toBe('?utm_source=readme&hue=45&dyeScope=all');
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
});
