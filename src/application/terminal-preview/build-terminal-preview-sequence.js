import {
  terminalPreviewHeaderLines,
  terminalPreviewPromptCommand,
} from '../../domain/terminal-preview/terminal-preview-model';
import { buildColorsPreviewCommand } from './build-colors-preview-command';
import { joinTerminalLines, styledText } from './ansi-terminal-sequence';

function renderPrompt({ command = null } = {}) {
  const prompt = terminalPreviewPromptCommand();
  let out = '';

  out += styledText(prompt.user, [36]);
  out += `@${prompt.host} `;
  out += styledText(prompt.directory, [36]);
  out += '> ';

  if (command) {
    out += styledText(command, [34]);
  }

  return out;
}

function renderHelpLine() {
  return `Type ${styledText('help', [32])} for instructions on how to use fish`;
}

export function buildTerminalPreviewSequence() {
  return joinTerminalLines([
    terminalPreviewHeaderLines()[0],
    renderHelpLine(),
    renderPrompt({ command: terminalPreviewPromptCommand().command }),
    '',
    buildColorsPreviewCommand(),
    '',
    renderPrompt(),
  ]);
}
