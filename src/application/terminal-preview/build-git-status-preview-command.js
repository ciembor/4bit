import { joinTerminalLines, styledText } from './ansi-terminal-sequence';

export function buildGitStatusPreviewCommand() {
  return joinTerminalLines([
    `On branch ${styledText('master', [36])}`,
    `Your branch is ahead of ${styledText('origin/master', [36])} by ${styledText('1 commit', [32])}.`,
    '  (use "git push" to publish your local commits)',
    '',
    'Changes to be committed:',
    '  (use "git restore --staged <file>..." to unstage)',
    `        ${styledText('modified:   src/application/terminal-preview/build-terminal-preview-sequence.js', [32])}`,
    `        ${styledText('new file:   src/application/terminal-preview/build-git-status-preview-command.js', [32])}`,
    '',
    'Changes not staged for commit:',
    '  (use "git add <file>..." to update what will be committed)',
    '  (use "git restore <file>..." to discard changes in working directory)',
    `        ${styledText('modified:   src/presentation/editor-page/terminal-preview/xterm-terminal-preview.js', [31])}`,
    `        ${styledText('deleted:    TODO.md', [31])}`,
    '',
    'Untracked files:',
    '  (use "git add <file>..." to include in what will be committed)',
    `        ${styledText('tests/application/terminal-preview/build-git-status-preview-command.test.js', [31])}`,
  ]);
}
