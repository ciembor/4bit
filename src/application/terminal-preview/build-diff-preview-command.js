import { joinTerminalLines, styledText } from './ansi-terminal-sequence';

export function buildDiffPreviewCommand() {
  return joinTerminalLines([
    styledText('diff --git a/theme.css b/theme.css', [1]),
    styledText('index 2a4f8c1..8b7e932 100644', [90]),
    styledText('--- a/theme.css', [31]),
    styledText('+++ b/theme.css', [32]),
    '@@ -1,8 +1,8 @@',
    ' .terminal {',
    styledText('-  color: #d7d7d7;', [31]),
    styledText('-  background: #151515;', [31]),
    styledText('+  color: #f0f0f0;', [32]),
    styledText('+  background: #101010;', [32]),
    '   border-radius: 4px;',
    ' }',
    ' .terminal .prompt {',
    styledText('-  color: #5fafd7;', [31]),
    styledText('+  color: #55ffff;', [32]),
    ' }',
    ' .terminal .selection {',
    styledText('-  background: #444444;', [31]),
    styledText('-  color: #eeeeee;', [31]),
    styledText('+  background: #808080;', [32]),
    styledText('+  color: #ffffff;', [32]),
    ' }',
  ]);
}
