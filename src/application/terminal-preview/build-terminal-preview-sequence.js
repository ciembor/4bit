import {
  terminalPreviewHeaderLines,
  terminalPreviewPromptCommand,
} from '../../domain/terminal-preview/terminal-preview-model';
import { buildColorsPreviewCommand } from './commands/build-colors-preview-command';
import { joinTerminalLines } from './ansi-terminal-sequence';
import {
  renderTerminalPreviewHelpLine,
  renderTerminalPreviewPrompt,
} from './terminal-preview-shell';

export function buildTerminalPreviewSequence() {
  return joinTerminalLines([
    terminalPreviewHeaderLines()[0],
    renderTerminalPreviewHelpLine(),
    renderTerminalPreviewPrompt({ command: terminalPreviewPromptCommand().command }),
    '',
    buildColorsPreviewCommand(),
    '',
    renderTerminalPreviewPrompt(),
  ]);
}
