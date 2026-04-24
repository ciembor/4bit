import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { calculateSchemeColors } from '../../../src/domain/scheme/color-scheme-calculator';
import { createDefaultScheme } from '../../../src/domain/scheme/scheme-defaults';
import { useCalculatedSchemeStore } from '../../../src/presentation/stores/calculated-scheme';
import { useSchemeStore } from '../../../src/presentation/stores/scheme';

const { watchMock } = vi.hoisted(() => ({
  watchMock: vi.fn(),
}));

vi.mock('vue', () => ({
  watch: watchMock,
}));

const { default: CalculatedSchemeSync } = await import(
  '../../../src/application/scheme/calculated-scheme-sync'
);

describe('CalculatedSchemeSync', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    watchMock.mockReset();
  });

  it('calculates the scheme immediately when constructed', () => {
    let stopCalls = 0;

    watchMock.mockImplementation((source, callback, options) => {
      if (options?.immediate) {
        callback(source());
      }

      return () => {
        stopCalls += 1;
      };
    });

    const schemeStore = useSchemeStore();
    const calculatedSchemeStore = useCalculatedSchemeStore();

    const sync = new CalculatedSchemeSync();

    expect(watchMock).toHaveBeenCalledTimes(1);
    expect(calculatedSchemeStore.calculatedScheme).toEqual(
      calculateSchemeColors(schemeStore.scheme)
    );

    sync.stop();
    expect(stopCalls).toBe(1);
    expect(sync.stopWatcher).toBeNull();
  });

  it('restarts with a custom watcher and stops the previous watcher first', () => {
    const previousStop = vi.fn();
    const nextStop = vi.fn();

    watchMock.mockReturnValue(previousStop);

    const sync = new CalculatedSchemeSync({
      schemeStore: { scheme: createDefaultScheme() },
      calculatedSchemeStore: { calculatedScheme: null },
    });

    const customWatch = vi.fn(() => nextStop);
    const returnedStop = sync.start(customWatch);

    expect(previousStop).toHaveBeenCalledTimes(1);
    expect(customWatch).toHaveBeenCalledTimes(1);
    expect(returnedStop).toBe(nextStop);

    sync.stop();
    expect(nextStop).toHaveBeenCalledTimes(1);
  });

  it('ignores null schemes when the watcher fires', () => {
    const calculatedSchemeStore = {
      calculatedScheme: { untouched: true },
    };

    watchMock.mockImplementation((source, callback, options) => {
      if (options?.immediate) {
        callback(source());
      }

      return vi.fn();
    });

    new CalculatedSchemeSync({
      schemeStore: { scheme: null },
      calculatedSchemeStore,
    });

    expect(calculatedSchemeStore.calculatedScheme).toEqual({ untouched: true });
  });
});
