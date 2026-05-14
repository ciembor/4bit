import { joinTerminalLines, styledText } from './ansi-terminal-sequence';

const FILE_TYPE_STYLES = {
  archive: [1, 31],
  directory: [1, 34],
  executable: [1, 32],
  pipe: [40, 33, 1],
  regular: [],
  socket: [1, 35],
  symlink: [1, 36],
};
const LS_COLUMNS = 80;
const LS_COLUMN_SEPARATOR = '  ';

const LS_ENTRIES = [
  { mode: 'drwxr-xr-x', links: 8, size: 256, time: 'May 14 12:04', name: '.', type: 'directory' },
  { mode: 'drwxr-xr-x', links: 14, size: 448, time: 'May 14 11:58', name: '..', type: 'directory' },
  { mode: 'drwxr-xr-x', links: 3, size: 96, time: 'May 14 11:59', name: 'about', type: 'directory' },
  { mode: 'drwxr-xr-x', links: 6, size: 192, time: 'May 14 12:00', name: 'dist', type: 'directory' },
  { mode: 'drwxr-xr-x', links: 9, size: 288, time: 'May 14 12:01', name: 'node_modules', type: 'directory' },
  { mode: 'drwxr-xr-x', links: 5, size: 160, time: 'May 14 12:01', name: 'src', type: 'directory' },
  { mode: 'drwxr-xr-x', links: 4, size: 128, time: 'May 14 12:01', name: 'tests', type: 'directory' },
  { mode: '-rw-r--r--', links: 1, size: 324, time: 'May 14 11:59', name: '.gitignore', type: 'regular' },
  { mode: '-rw-r--r--', links: 1, size: 1789, time: 'May 14 12:02', name: 'README.md', type: 'regular' },
  { mode: '-rw-r--r--', links: 1, size: 394, time: 'May 14 12:00', name: 'index.html', type: 'regular' },
  { mode: '-rw-r--r--', links: 1, size: 1094, time: 'May 14 12:02', name: 'package.json', type: 'regular' },
  { mode: '-rw-r--r--', links: 1, size: 8240, time: 'May 14 12:02', name: 'package-lock.json', type: 'regular' },
  { mode: '-rw-r--r--', links: 1, size: 708, time: 'May 14 12:01', name: 'playwright.config.js', type: 'regular' },
  { mode: '-rw-r--r--', links: 1, size: 611, time: 'May 14 12:01', name: 'vite.config.js', type: 'regular' },
  { mode: '-rwxr-xr-x', links: 1, size: 420, time: 'May 14 12:03', name: 'build.sh', type: 'executable' },
  { mode: '-rwxr-xr-x', links: 1, size: 368, time: 'May 14 12:03', name: 'deploy.sh', type: 'executable' },
  { mode: 'lrwxr-xr-x', links: 1, size: 11, time: 'May 14 12:03', name: 'current', type: 'symlink', target: 'dist' },
  { mode: 'lrwxr-xr-x', links: 1, size: 15, time: 'May 14 12:03', name: 'public-assets', type: 'symlink', target: 'dist/assets' },
  { mode: '-rw-r--r--', links: 1, size: 2048, time: 'May 14 12:03', name: 'theme.tar.gz', type: 'archive' },
  { mode: 'srwxr-xr-x', links: 1, size: 0, time: 'May 14 12:04', name: 'preview.sock', type: 'socket' },
  { mode: 'prw-r--r--', links: 1, size: 0, time: 'May 14 12:04', name: 'status.pipe', type: 'pipe' },
];

function styleEntryName(entry) {
  const style = FILE_TYPE_STYLES[entry.type] ?? FILE_TYPE_STYLES.regular;

  if (style.length === 0) {
    return entry.name;
  }

  return styledText(entry.name, style);
}

function renderLsName(entry) {
  if (!entry.target) {
    return styleEntryName(entry);
  }

  return `${styleEntryName(entry)} -> ${styleEntryName({ name: entry.target, type: 'directory' })}`;
}

function plainLsName(entry) {
  if (!entry.target) {
    return entry.name;
  }

  return `${entry.name} -> ${entry.target}`;
}

function renderLsAllLine(entry) {
  return [
    entry.mode,
    String(entry.links).padStart(2, ' '),
    'ciembor',
    'staff',
    String(entry.size).padStart(4, ' '),
    entry.time,
    renderLsName(entry),
  ].join(' ');
}

function packLsRows(entries) {
  const rows = [];
  let currentRow = [];
  let currentWidth = 0;

  entries.forEach((entry) => {
    const width = plainLsName(entry).length;
    const separatorWidth = currentRow.length === 0 ? 0 : LS_COLUMN_SEPARATOR.length;

    if (currentRow.length > 0 && currentWidth + separatorWidth + width > LS_COLUMNS) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }

    currentRow.push(renderLsName(entry));
    currentWidth += (currentRow.length === 1 ? 0 : LS_COLUMN_SEPARATOR.length) + width;
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

export function buildLsPreviewCommand() {
  const rows = packLsRows(LS_ENTRIES).map((row) => row.join(LS_COLUMN_SEPARATOR));

  return joinTerminalLines(rows);
}

export function buildLsAllPreviewCommand() {
  return joinTerminalLines([
    'total 120',
    ...LS_ENTRIES.map(renderLsAllLine),
  ]);
}
