import {
  COLOR_NAMES,
  colorKeyDict,
  colorSlotNumber,
  schemeName,
} from './shared';

export function serializeITerm2(colors) {
  let out = '';
  const name = schemeName(colors);

  out += '<?xml version="1.0" encoding="UTF-8"?>\n';
  out += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
  out += '\n<!--\n\n';
  out += `      Save this file to ${name}.itermcolors                                    \n`;
  out += '      and load it with iTerm2 Preferences panel                                 \n';
  out += '                                                                                \n';
  out += '      generated with 4bit Terminal Color Scheme Designer                        \n';
  out += '                                                                                \n';
  out += '      http://ciembor.github.io/4bit                                             \n';
  out += '                                                                                \n';
  out += '-->\n\n';

  out += '<plist version="1.0">\n';
  out += '<dict>\n';

  out += '<!-- special colors -->\n';
  out += colorKeyDict(colors, 'background', 'Background');
  out += colorKeyDict(colors, 'foreground', 'Foreground');
  out += colorKeyDict(colors, 'foreground', 'Cursor');
  out += colorKeyDict(colors, 'background', 'Cursor Text');

  out += '<!-- standard colors -->\n';
  COLOR_NAMES.forEach((name, index) => {
    const number = colorSlotNumber(name, index);

    out += `\t<!-- ${name} -->\n`;
    out += colorKeyDict(colors, name, `Ansi ${number}`);
  });

  out += '</dict>\n';
  out += '</plist>\n';
  out += '\n';

  return out;
}
