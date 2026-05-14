import {
  TERMINAL_PREVIEW_COLUMNS,
  TERMINAL_PREVIEW_ROWS,
  TERMINAL_PREVIEW_SAMPLE_TEXT,
} from '../../../domain/terminal-preview/terminal-preview-model';
import {
  joinTerminalLines,
  resetSgr,
  styledText,
} from '../ansi-terminal-sequence';

const ROW_LABEL_WIDTH = 6;
const CELL_WIDTH = 7;
const CELL_SEPARATOR = ' ';
const ROW_LABEL_SEPARATOR = ' ';

function padRight(value, width) {
  return value.padEnd(width, ' ');
}

function padLeft(value, width) {
  return value.padStart(width, ' ');
}

function padCenter(value, width) {
  const availablePadding = Math.max(width - value.length, 0);
  const leftPadding = Math.floor(availablePadding / 2);
  const rightPadding = availablePadding - leftPadding;

  return `${' '.repeat(leftPadding)}${value}${' '.repeat(rightPadding)}`;
}

function renderTableHeader() {
  const labels = TERMINAL_PREVIEW_COLUMNS.map((column) => padCenter(column.label, CELL_WIDTH));

  return `${padRight('', ROW_LABEL_WIDTH)}${ROW_LABEL_SEPARATOR}${labels.join(CELL_SEPARATOR)}`;
}

function renderTableRow(row) {
  const label = padLeft(row.label, ROW_LABEL_WIDTH);
  const cells = TERMINAL_PREVIEW_COLUMNS.map((column) => {
    const codes = [...row.sgr, ...column.sgr];
    const sample = padCenter(TERMINAL_PREVIEW_SAMPLE_TEXT, CELL_WIDTH);

    return styledText(sample, codes);
  });

  return `${label}${ROW_LABEL_SEPARATOR}${cells.join(CELL_SEPARATOR)}${resetSgr()}`;
}

export function buildColorsPreviewCommand() {
  return joinTerminalLines([
    renderTableHeader(),
    ...TERMINAL_PREVIEW_ROWS.map((row) => renderTableRow(row)),
  ]);
}
