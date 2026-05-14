import { terminalPreviewPromptCommand } from '../../domain/terminal-preview/terminal-preview-model';
import { buildColorsPreviewCommand } from './commands/build-colors-preview-command';
import { buildDiffPreviewCommand } from './commands/build-diff-preview-command';
import { buildGitStatusPreviewCommand } from './commands/build-git-status-preview-command';
import {
  buildLsAllPreviewCommand,
  buildLsPreviewCommand,
} from './commands/build-ls-preview-command';
import { joinTerminalLines, styledText } from './ansi-terminal-sequence';

export const TERMINAL_PREVIEW_CLEAR_COMMAND = { type: 'clear' };

export function renderTerminalPreviewPrompt({ command = null } = {}) {
  const prompt = terminalPreviewPromptCommand();
  let out = '';

  out += styledText(prompt.user, [36]);
  out += `@${prompt.host} `;
  out += styledText(prompt.directory, [36]);
  out += '> ';

  if (command) {
    out += command;
  }

  return out;
}

export function renderTerminalPreviewHelpLine() {
  return `Type ${styledText('help', [32])} to see available commands.`;
}

function renderAvailableCommands() {
  return joinTerminalLines([
    'Available commands:',
    '  clear',
    '  colors',
    '  git diff',
    '  git status',
    '  ls',
    '  ls -al',
  ]);
}

export function runTerminalPreviewCommand(command) {
  const normalizedCommand = command.trim();

  if (normalizedCommand === '') {
    return '';
  }

  if (normalizedCommand === 'clear') {
    return TERMINAL_PREVIEW_CLEAR_COMMAND;
  }

  if (normalizedCommand === 'colors' || normalizedCommand === terminalPreviewPromptCommand().command) {
    return buildColorsPreviewCommand();
  }

  if (normalizedCommand === 'git diff' || normalizedCommand === 'diff') {
    return buildDiffPreviewCommand();
  }

  if (normalizedCommand === 'ls') {
    return buildLsPreviewCommand();
  }

  if (normalizedCommand === 'ls -al') {
    return buildLsAllPreviewCommand();
  }

  if (normalizedCommand === 'git status') {
    return buildGitStatusPreviewCommand();
  }

  if (normalizedCommand === 'help') {
    return renderAvailableCommands();
  }

  return joinTerminalLines([
    `zsh: command not found: ${normalizedCommand}`,
    '',
    renderAvailableCommands(),
  ]);
}
