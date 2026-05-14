import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

const TERMINAL_COLUMNS = 80;
const TERMINAL_ROWS = 25;
const TERMINAL_SCROLLBACK_ROWS = 1000;
const TERMINAL_FONT_SIZE = 20;
const TERMINAL_FONT_FAMILY = 'Inconsolata, monospace';
const TERMINAL_FONT_LOAD = `${TERMINAL_FONT_SIZE}px Inconsolata`;
const BACKSPACE = '\x7F';
const CARRIAGE_RETURN = '\r';
const LINE_BREAK = '\r\n';
const CLEAR_FROM_CURSOR = '\x1b[J';

function waitForTerminalFont() {
  if (!document.fonts?.load) {
    return Promise.resolve();
  }

  return document.fonts.load(TERMINAL_FONT_LOAD).then(() => document.fonts.ready);
}

export function createTerminalView(container, options = {}, dependencies = {}) {
  const TerminalClass = dependencies.TerminalClass ?? Terminal;
  const waitForFont = dependencies.waitForFont ?? waitForTerminalFont;
  let terminal = null;
  let disposed = false;
  let lastSequence = '';
  let renderedSequence = '';
  let lastTheme = options.theme;
  let currentInput = '';
  let activeDynamicCommand = null;
  let activeDynamicLineCount = 0;
  let dataDisposable = null;

  function prompt() {
    return options.prompt ?? '';
  }

  function runCommand(command) {
    return options.runCommand?.(command) ?? '';
  }

  function writePrompt() {
    terminal.write(prompt());
  }

  function dynamicLineCount(output) {
    return output.content.split(LINE_BREAK).length;
  }

  function writeCommandOutput(output) {
    terminal.write(output.content);
    terminal.write(LINE_BREAK);
    terminal.write(LINE_BREAK);
    writePrompt();
  }

  function writeDynamicCommand(output) {
    activeDynamicLineCount = dynamicLineCount(output);
    writeCommandOutput(output);
  }

  function rewriteDynamicCommand(output) {
    const linesToOutputStart = activeDynamicLineCount + 1;
    terminal.write(`\x1b[${linesToOutputStart}A\r${CLEAR_FROM_CURSOR}`);
    writeDynamicCommand(output);
  }

  function createTerminal() {
    return new TerminalClass({
      allowProposedApi: false,
      cols: TERMINAL_COLUMNS,
      rows: TERMINAL_ROWS,
      convertEol: true,
      cursorBlink: true,
      cursorStyle: 'block',
      disableStdin: false,
      fontFamily: TERMINAL_FONT_FAMILY,
      fontSize: TERMINAL_FONT_SIZE,
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      lineHeight: 1,
      letterSpacing: -0.5,
      screenReaderMode: true,
      scrollback: TERMINAL_SCROLLBACK_ROWS,
      theme: lastTheme,
    });
  }

  function openTerminal() {
    if (disposed || terminal) {
      return;
    }

    terminal = createTerminal();
    terminal.open(container);
    terminal.focus?.();
    dataDisposable = terminal.onData?.(handleData);

    if (lastSequence) {
      render(lastSequence, lastTheme);
    }
  }

  waitForFont().then(openTerminal);

  function handleBackspace() {
    if (currentInput.length === 0) {
      return;
    }

    currentInput = currentInput.slice(0, -1);
    terminal.write('\b \b');
  }

  function handleEnter() {
    const command = currentInput;
    const output = runCommand(command);
    currentInput = '';

    terminal.write(LINE_BREAK);

    if (output?.type === 'clear') {
      activeDynamicCommand = null;
      activeDynamicLineCount = 0;
      renderedSequence = lastSequence;
      terminal.reset();
      writePrompt();
      return;
    }

    if (output?.type === 'dynamic') {
      activeDynamicCommand = command;
      writeDynamicCommand(output);
      return;
    }

    activeDynamicCommand = null;
    activeDynamicLineCount = 0;

    if (output) {
      writeCommandOutput({ content: output });
      return;
    }

    writePrompt();
  }

  function handleData(data) {
    if (!terminal) {
      return;
    }

    if (data === CARRIAGE_RETURN) {
      handleEnter();
      return;
    }

    if (data === BACKSPACE) {
      handleBackspace();
      return;
    }

    if (/^[\x20-\x7E]+$/.test(data)) {
      activeDynamicCommand = null;
      activeDynamicLineCount = 0;
      currentInput += data;
      terminal.write(data);
    }
  }

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
    currentInput = '';
    activeDynamicCommand = null;
    activeDynamicLineCount = 0;
    terminal.write(sequence);
  }

  function refreshDynamicCommand() {
    if (!terminal || !activeDynamicCommand) {
      return;
    }

    const output = runCommand(activeDynamicCommand);

    if (output?.type !== 'dynamic') {
      activeDynamicCommand = null;
      activeDynamicLineCount = 0;
      return;
    }

    rewriteDynamicCommand(output);
  }

  return {
    render,
    refreshDynamicCommand,
    dispose() {
      disposed = true;
      dataDisposable?.dispose();
      terminal?.dispose();
    },
  };
}
