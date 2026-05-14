export const TERMINAL_PREVIEW_COLUMNS = [
  { label: ' ', colorName: 'background', sgr: [] },
  { label: '40m', colorName: 'black', sgr: [40] },
  { label: '41m', colorName: 'red', sgr: [41] },
  { label: '42m', colorName: 'green', sgr: [42] },
  { label: '43m', colorName: 'yellow', sgr: [43] },
  { label: '44m', colorName: 'blue', sgr: [44] },
  { label: '45m', colorName: 'magenta', sgr: [45] },
  { label: '46m', colorName: 'cyan', sgr: [46] },
  { label: '47m', colorName: 'white', sgr: [47] },
];

export const TERMINAL_PREVIEW_ROWS = [
  { label: 'm', colorName: 'foreground', sgr: [] },
  { label: '1m', colorName: 'brightForeground', sgr: [1] },
  { label: '30m', colorName: 'black', sgr: [30] },
  { label: '1;30m', colorName: 'brightBlack', sgr: [1, 30] },
  { label: '31m', colorName: 'red', sgr: [31] },
  { label: '1;31m', colorName: 'brightRed', sgr: [1, 31] },
  { label: '32m', colorName: 'green', sgr: [32] },
  { label: '1;32m', colorName: 'brightGreen', sgr: [1, 32] },
  { label: '33m', colorName: 'yellow', sgr: [33] },
  { label: '1;33m', colorName: 'brightYellow', sgr: [1, 33] },
  { label: '34m', colorName: 'blue', sgr: [34] },
  { label: '1;34m', colorName: 'brightBlue', sgr: [1, 34] },
  { label: '35m', colorName: 'magenta', sgr: [35] },
  { label: '1;35m', colorName: 'brightMagenta', sgr: [1, 35] },
  { label: '36m', colorName: 'cyan', sgr: [36] },
  { label: '1;36m', colorName: 'brightCyan', sgr: [1, 36] },
  { label: '37m', colorName: 'white', sgr: [37] },
  { label: '1;37m', colorName: 'brightWhite', sgr: [1, 37] },
];

export const TERMINAL_PREVIEW_SAMPLE_TEXT = 'gYw';

export function terminalPreviewHeaderLines() {
  return [
    'Welcome to 4bit, the Terminal Color Scheme Designer.',
    'Type help to see available commands.',
  ];
}

export function terminalPreviewPromptCommand() {
  return {
    user: 'ciembor',
    host: 'browser',
    directory: '~',
    command: 'colors',
  };
}

export function terminalPreviewRows() {
  return TERMINAL_PREVIEW_ROWS;
}
