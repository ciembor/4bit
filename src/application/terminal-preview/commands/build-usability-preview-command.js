import { joinTerminalLines, styledText } from '../ansi-terminal-sequence';

const MIN_TEXT_CONTRAST = 4.5;
const WARN_TEXT_CONTRAST = 3;

const ANSI_COLOR_CHECKS = [
  ['black', 'black', [30]],
  ['red', 'red', [31]],
  ['green', 'green', [32]],
  ['yellow', 'yellow', [33]],
  ['blue', 'blue', [34]],
  ['magenta', 'magenta', [35]],
  ['cyan', 'cyan', [36]],
  ['white', 'white', [37]],
  ['bright black', 'brightBlack', [90]],
  ['bright red', 'brightRed', [91]],
  ['bright green', 'brightGreen', [92]],
  ['bright yellow', 'brightYellow', [93]],
  ['bright blue', 'brightBlue', [94]],
  ['bright magenta', 'brightMagenta', [95]],
  ['bright cyan', 'brightCyan', [96]],
  ['bright white', 'brightWhite', [97]],
];

const CELL_WIDTH = 36;
const LABEL_WIDTH = 16;
const RATIO_WIDTH = 6;

function rgbChannels(color) {
  return color?.rgb?.().array?.() ?? null;
}

function linearChannel(value) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color) {
  const channels = rgbChannels(color);

  if (!channels) {
    return null;
  }

  const [red, green, blue] = channels.map(linearChannel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);

  if (foregroundLuminance === null || backgroundLuminance === null) {
    return null;
  }

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastStatus(ratio, threshold = MIN_TEXT_CONTRAST) {
  if (ratio === null) {
    return 'N/A';
  }

  if (ratio >= threshold) {
    return 'PASS';
  }

  if (ratio >= WARN_TEXT_CONTRAST) {
    return 'WARN';
  }

  return 'FAIL';
}

function styledStatus(status) {
  if (status === 'PASS') {
    return styledText(status, [32]);
  }

  if (status === 'WARN') {
    return styledText(status, [33]);
  }

  if (status === 'FAIL') {
    return styledText(status, [31]);
  }

  return status;
}

function formatRatio(ratio) {
  return ratio === null ? 'n/a'.padStart(6) : `${ratio.toFixed(1)}:1`.padStart(6);
}

function visiblePadding(value, width) {
  return ' '.repeat(Math.max(0, width - value.length));
}

function formatCell(label, ratio, threshold = MIN_TEXT_CONTRAST, displayLabel = label) {
  const status = contrastStatus(ratio, threshold);
  const value = formatRatio(ratio);
  const cell = `${displayLabel}${visiblePadding(label, LABEL_WIDTH)} ${value} ${styledStatus(status)}`;
  const visibleCell = `${label}${visiblePadding(label, LABEL_WIDTH)} ${value} ${status}`;
  return `${cell}${visiblePadding(visibleCell, CELL_WIDTH)}`;
}

function formatRow(leftCheck, rightCheck) {
  const left = leftCheck ? formatCell(...leftCheck) : ' '.repeat(CELL_WIDTH);

  if (!rightCheck) {
    return `| ${left} | ${' '.repeat(CELL_WIDTH)} |`;
  }

  return `| ${left} | ${formatCell(...rightCheck)} |`;
}

function pairChecks(checks) {
  const foreground = checks[0];
  const colorChecks = checks.slice(1);
  const midpoint = colorChecks.length / 2;
  const leftColumn = [foreground, ...colorChecks.slice(0, midpoint)];
  const rightColumn = [null, ...colorChecks.slice(midpoint)];

  return leftColumn.map((check, index) => [check, rightColumn[index]]);
}

function tableBorder() {
  return `+${'-'.repeat(CELL_WIDTH + 2)}+${'-'.repeat(CELL_WIDTH + 2)}+`;
}

function tableHeader() {
  const header = `${'check'.padEnd(LABEL_WIDTH)} ${'ratio'.padStart(RATIO_WIDTH)} result`;
  return `| ${header}${visiblePadding(header, CELL_WIDTH)} | ${header}${visiblePadding(header, CELL_WIDTH)} |`;
}

function tableRows(checks) {
  return [
    tableBorder(),
    tableHeader(),
    tableBorder(),
    ...pairChecks(checks).map(([leftCheck, rightCheck]) => formatRow(leftCheck, rightCheck)),
    tableBorder(),
  ];
}

function buildChecks(colors) {
  const background = colors?.background;

  return [
    [
      'foreground',
      contrastRatio(colors?.foreground, background),
      MIN_TEXT_CONTRAST,
      styledText('foreground', [39]),
    ],
    ...ANSI_COLOR_CHECKS.map(([label, colorName, style]) => [
      label,
      contrastRatio(colors?.[colorName], background),
      MIN_TEXT_CONTRAST,
      styledText(label, style),
    ]),
  ];
}

export function buildUsabilityPreviewCommand(colors) {
  const checks = buildChecks(colors);

  return joinTerminalLines([
    '',
    'Checks if terminal text colors stay readable on the background.',
    `Uses ${styledText('WCAG', [1])} 2.x contrast: ${styledStatus('PASS')} >= 4.5:1, ${styledStatus('WARN')} >= 3.0:1, ${styledStatus('FAIL')} < 3.0:1.`,
    '',
    ...tableRows(checks),
  ]);
}
