import { describe, expect, it, vi } from 'vitest';
import { createXtermTerminalPreview } from '../../../src/presentation/editor-page/terminal-preview/xterm-terminal-preview';

function createTerminalClass() {
  const instances = [];

  class TerminalClass {
    constructor(options) {
      this.options = options;
      this.open = vi.fn();
      this.reset = vi.fn();
      this.write = vi.fn();
      this.dispose = vi.fn();
      instances.push(this);
    }
  }

  return { TerminalClass, instances };
}

describe('createXtermTerminalPreview', () => {
  it('waits for the terminal font before opening xterm', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    let resolveFont;
    const waitForFont = vi.fn(() => new Promise((resolve) => {
      resolveFont = resolve;
    }));
    const container = {};

    createXtermTerminalPreview(container, {}, { TerminalClass, waitForFont });

    expect(waitForFont).toHaveBeenCalledTimes(1);
    expect(instances).toHaveLength(0);

    resolveFont();
    await Promise.resolve();

    expect(instances).toHaveLength(1);
    expect(instances[0].open).toHaveBeenCalledWith(container);
  });

  it('updates theme without rewriting unchanged terminal content', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    const preview = createXtermTerminalPreview({}, {}, {
      TerminalClass,
      waitForFont: () => Promise.resolve(),
    });

    preview.render('same-sequence', { background: '#000000' });
    await Promise.resolve();

    const terminal = instances[0];
    expect(terminal.reset).toHaveBeenCalledTimes(1);
    expect(terminal.write).toHaveBeenCalledTimes(1);
    expect(terminal.write).toHaveBeenCalledWith('same-sequence');
    expect(terminal.options.theme).toEqual({ background: '#000000' });

    preview.render('same-sequence', { background: '#111111' });

    expect(terminal.reset).toHaveBeenCalledTimes(1);
    expect(terminal.write).toHaveBeenCalledTimes(1);
    expect(terminal.options.theme).toEqual({ background: '#111111' });
  });

  it('rewrites terminal content when the sequence changes', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    const preview = createXtermTerminalPreview({}, {}, {
      TerminalClass,
      waitForFont: () => Promise.resolve(),
    });

    preview.render('first-sequence', {});
    await Promise.resolve();
    preview.render('second-sequence', {});

    expect(instances[0].reset).toHaveBeenCalledTimes(2);
    expect(instances[0].write).toHaveBeenCalledTimes(2);
    expect(instances[0].write).toHaveBeenLastCalledWith('second-sequence');
  });
});
