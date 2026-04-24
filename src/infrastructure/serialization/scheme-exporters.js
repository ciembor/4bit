import { COLOR_NAMES } from '../../domain/scheme/color-names';
import { serializeAlacritty } from './scheme-exports/alacritty';
import { serializeGnomeTerminal } from './scheme-exports/gnome-terminal';
import { serializeGuake } from './scheme-exports/guake';
import { serializeITerm2 } from './scheme-exports/iterm2';
import { serializeKonsole } from './scheme-exports/konsole';
import { serializeMintty } from './scheme-exports/mintty';
import { serializePutty } from './scheme-exports/putty';
import { serializeTerminator } from './scheme-exports/terminator';
import { serializeXfceTerminal } from './scheme-exports/xfce-terminal';
import { serializeXresources } from './scheme-exports/xresources';

const TEXT_MIME_TYPE = 'text/plain;charset=utf-8';
const XML_MIME_TYPE = 'application/xml;charset=utf-8';

const EXPORT_BUILDERS = {
  alacritty: serializeAlacritty,
  xresources: serializeXresources,
  guake: serializeGuake,
  gnomeTerminal: serializeGnomeTerminal,
  konsole: serializeKonsole,
  iTerm2: serializeITerm2,
  xfceTerminal: serializeXfceTerminal,
  mintty: serializeMintty,
  putty: serializePutty,
  terminator: serializeTerminator,
};

export const SCHEME_DOWNLOADS = [
  {
    id: 'alacritty',
    buttonId: 'alacritty-button',
    text: 'alacritty',
    linkLabel: 'alacritty.yml',
    downloadName: 'alacritty.yml',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'xresources',
    buttonId: 'xresources-button',
    text: 'aterm / rxvt / urxvt / xterm',
    linkLabel: '.Xresources',
    downloadName: '.Xresources',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'gnomeTerminal',
    buttonId: 'gnome-terminal-button',
    text: 'gnome terminal',
    linkLabel: 'shell',
    downloadName: 'set_colors.sh',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'guake',
    buttonId: 'guake-button',
    text: 'guake',
    linkLabel: 'shell',
    downloadName: 'set_colors.sh',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'iTerm2',
    buttonId: 'iterm2-button',
    text: 'iTerm2',
    linkLabel: '*.itermcolors',
    downloadName: '4bit.itermcolors',
    mimeType: XML_MIME_TYPE,
  },
  {
    id: 'konsole',
    buttonId: 'konsole-button',
    text: 'konsole / yakuake',
    linkLabel: '*.colorscheme',
    downloadName: '4bit.colorscheme',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'mintty',
    buttonId: 'mintty-button',
    text: 'mintty',
    linkLabel: '.minttyrc',
    downloadName: '4bit-color-scheme.minttyrc',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'putty',
    buttonId: 'putty-button',
    text: 'putty',
    linkLabel: '*.reg',
    downloadName: '4bit-putty-color-scheme.reg',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'terminator',
    buttonId: 'terminator-button',
    text: 'terminator',
    linkLabel: 'config',
    downloadName: 'config',
    mimeType: TEXT_MIME_TYPE,
  },
  {
    id: 'xfceTerminal',
    buttonId: 'xfce-terminal-button',
    text: 'xfce4 terminal',
    linkLabel: '*.scheme',
    downloadName: '4bit.scheme',
    mimeType: TEXT_MIME_TYPE,
  },
];

export function canExportScheme(colors) {
  return ['background', 'foreground', ...COLOR_NAMES].every((name) => colors?.[name]);
}

export function buildSchemeDownload(exportId, colors) {
  const buildContent = EXPORT_BUILDERS[exportId];
  const definition = SCHEME_DOWNLOADS.find((item) => item.id === exportId);

  if (!buildContent || !definition) {
    throw new Error(`Unknown export format: ${exportId}`);
  }

  return new Blob([buildContent(colors)], { type: definition.mimeType });
}
