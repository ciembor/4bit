export const TERMINAL_LINE_BREAK = '\r\n';

export function sgr(...codes) {
  if (codes.length === 0) {
    return '';
  }

  return `\x1b[${codes.join(';')}m`;
}

export function resetSgr() {
  return '\x1b[0m';
}

export function styledText(text, codes) {
  return `${sgr(...codes)}${text}${resetSgr()}`;
}

export function joinTerminalLines(lines) {
  return lines.join(TERMINAL_LINE_BREAK);
}
