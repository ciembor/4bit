import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

const TERMINAL_COLUMNS = 80;
const TERMINAL_ROWS = 25;
const TERMINAL_FONT_SIZE = 20;
const TERMINAL_FONT_FAMILY = 'Inconsolata, monospace';
const TERMINAL_FONT_LOAD = `${TERMINAL_FONT_SIZE}px Inconsolata`;

function waitForTerminalFont() {
  if (!document.fonts?.load) {
    return Promise.resolve();
  }

  return document.fonts.load(TERMINAL_FONT_LOAD).then(() => document.fonts.ready);
}

export function createXtermTerminalPreview(container, options = {}, dependencies = {}) {
  const TerminalClass = dependencies.TerminalClass ?? Terminal;
  const waitForFont = dependencies.waitForFont ?? waitForTerminalFont;
  let terminal = null;
  let disposed = false;
  let lastSequence = '';
  let renderedSequence = '';
  let lastTheme = options.theme;

  function createTerminal() {
    return new TerminalClass({
      allowProposedApi: false,
      cols: TERMINAL_COLUMNS,
      rows: TERMINAL_ROWS,
      convertEol: true,
      cursorBlink: false,
      cursorStyle: 'block',
      disableStdin: true,
      fontFamily: TERMINAL_FONT_FAMILY,
      fontSize: TERMINAL_FONT_SIZE,
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      lineHeight: 1,
      letterSpacing: -0.5,
      screenReaderMode: true,
      scrollback: 0,
      theme: lastTheme,
    });
  }

  function openTerminal() {
    if (disposed || terminal) {
      return;
    }

    terminal = createTerminal();
    terminal.open(container);

    if (lastSequence) {
      render(lastSequence, lastTheme);
    }
  }

  waitForFont().then(openTerminal);

  function render(sequence, theme) {
    lastSequence = sequence;
    lastTheme = theme;

    if (!terminal) {
      return;
    }

    terminal.options.theme = theme;

    if (sequence === renderedSequence) {
      return;
    }

    renderedSequence = sequence;
    terminal.reset();
    terminal.write(sequence);
  }

  return {
    render,
    dispose() {
      disposed = true;
      terminal?.dispose();
    },
  };
}
