import { describe, expect, it, vi } from 'vitest';
import { createTerminalView } from '../../../src/presentation/editor-page/terminal-preview/terminal-view';

function createTerminalClass() {
  const instances = [];

  class TerminalClass {
    constructor(options) {
      this.options = options;
      this.open = vi.fn();
      this.focus = vi.fn();
      this.reset = vi.fn();
      this.write = vi.fn();
      this.dispose = vi.fn();
      this.onData = vi.fn((handler) => {
        this.dataHandler = handler;
        return { dispose: vi.fn() };
      });
      instances.push(this);
    }
  }

  return { TerminalClass, instances };
}

describe('createTerminalView', () => {
  it('waits for the terminal font before opening the terminal view', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    let resolveFont;
    const waitForFont = vi.fn(() => new Promise((resolve) => {
      resolveFont = resolve;
    }));
    const container = {};

    createTerminalView(container, {}, { TerminalClass, waitForFont });

    expect(waitForFont).toHaveBeenCalledTimes(1);
    expect(instances).toHaveLength(0);

    resolveFont();
    await Promise.resolve();

    expect(instances).toHaveLength(1);
    expect(instances[0].options.scrollback).toBe(1000);
    expect(instances[0].open).toHaveBeenCalledWith(container);
    expect(instances[0].focus).toHaveBeenCalledTimes(1);
    expect(instances[0].onData).toHaveBeenCalledTimes(1);
  });

  it('updates theme without rewriting unchanged terminal content', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    const preview = createTerminalView({}, {}, {
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
    const preview = createTerminalView({}, {}, {
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

  it('echoes typed commands and writes command output on enter', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    const preview = createTerminalView({}, {
      prompt: 'ciembor@browser ~> ',
      runCommand: (command) => command === 'diff' ? 'diff-output' : '',
    }, {
      TerminalClass,
      waitForFont: () => Promise.resolve(),
    });

    preview.render('initial-sequence', {});
    await Promise.resolve();

    const terminal = instances[0];
    terminal.write.mockClear();

    terminal.dataHandler('diff');
    terminal.dataHandler('\r');

    expect(terminal.write.mock.calls.map(([value]) => value)).toEqual([
      'diff',
      '\r\n',
      'diff-output',
      '\r\n',
      '\r\n',
      'ciembor@browser ~> ',
    ]);
  });

  it('supports backspace while editing the current command', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    const runCommand = vi.fn(() => 'ok');
    const preview = createTerminalView({}, {
      prompt: '> ',
      runCommand,
    }, {
      TerminalClass,
      waitForFont: () => Promise.resolve(),
    });

    preview.render('initial-sequence', {});
    await Promise.resolve();

    const terminal = instances[0];
    terminal.write.mockClear();

    terminal.dataHandler('colorx');
    terminal.dataHandler('\x7F');
    terminal.dataHandler('s');
    terminal.dataHandler('\r');

    expect(runCommand).toHaveBeenCalledWith('colors');
    expect(terminal.write.mock.calls.map(([value]) => value)).toContain('\b \b');
  });

  it('clears the terminal and keeps later theme updates from restoring the boot transcript', async () => {
    const { TerminalClass, instances } = createTerminalClass();
    const preview = createTerminalView({}, {
      prompt: '> ',
      runCommand: (command) => command === 'clear' ? { type: 'clear' } : '',
    }, {
      TerminalClass,
      waitForFont: () => Promise.resolve(),
    });

    preview.render('boot-sequence', { background: '#000000' });
    await Promise.resolve();

    const terminal = instances[0];
    terminal.write.mockClear();
    terminal.reset.mockClear();

    terminal.dataHandler('clear');
    terminal.dataHandler('\r');

    expect(terminal.write.mock.calls.map(([value]) => value)).toEqual([
      'clear',
      '\r\n',
      '> ',
    ]);
    expect(terminal.reset).toHaveBeenCalledTimes(1);

    preview.render('boot-sequence', { background: '#111111' });

    expect(terminal.write.mock.calls.map(([value]) => value)).toEqual([
      'clear',
      '\r\n',
      '> ',
    ]);
    expect(terminal.reset).toHaveBeenCalledTimes(1);
    expect(terminal.options.theme).toEqual({ background: '#111111' });
  });
});
