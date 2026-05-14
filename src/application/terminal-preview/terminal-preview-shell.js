import { terminalPreviewPromptCommand } from '../../domain/terminal-preview/terminal-preview-model';
import { buildColorsPreviewCommand } from './commands/build-colors-preview-command';
import { buildDiffPreviewCommand } from './commands/build-diff-preview-command';
import { buildGitStatusPreviewCommand } from './commands/build-git-status-preview-command';
import {
  buildLsAllPreviewCommand,
  buildLsPreviewCommand,
} from './commands/build-ls-preview-command';
import { buildUsabilityPreviewCommand } from './commands/build-usability-preview-command';
import { joinTerminalLines, styledText } from './ansi-terminal-sequence';

export const TERMINAL_PREVIEW_CLEAR_COMMAND = { type: 'clear' };

function dynamicCommandOutput(content) {
  return {
    type: 'dynamic',
    content,
  };
}

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
    '',
    'Tools:',
    `  ${styledText('clear', [35])}      Clear the terminal screen.`,
    `  ${styledText('colors', [35])}     Show the ANSI color matrix.`,
    `  ${styledText('usability', [35])}  Check WCAG-based text contrast.`,
    '',
    'Examples:',
    `  ${styledText('git diff', [36])}   Show a colored git diff sample.`,
    `  ${styledText('git status', [36])} Show a colored git status sample.`,
    `  ${styledText('ls', [36])}         Show a compact directory listing.`,
    `  ${styledText('ls -al', [36])}     Show a detailed directory listing.`,
  ]);
}

export function runTerminalPreviewCommand(command, context = {}) {
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

  if (normalizedCommand === 'usability' || normalizedCommand === 'wcag') {
    return dynamicCommandOutput(buildUsabilityPreviewCommand(context.colors));
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
