import { describe, expect, it, vi } from 'vitest';
import Color from 'color';
import { bgrHex } from '../../../src/infrastructure/serialization/scheme-exports/conemu';
import {
  SCHEME_DOWNLOADS,
  buildSchemeDownload,
  canExportScheme,
} from '../../../src/infrastructure/serialization/scheme-exporters';

function createColors() {
  return {
    background: Color('#101010'),
    foreground: Color('#f0f0f0'),
    black: Color('#000000'),
    brightBlack: Color('#808080'),
    red: Color('#cc0000'),
    brightRed: Color('#ff5555'),
    green: Color('#00aa00'),
    brightGreen: Color('#55ff55'),
    yellow: Color('#aa5500'),
    brightYellow: Color('#ffff55'),
    blue: Color('#0000aa'),
    brightBlue: Color('#5555ff'),
    magenta: Color('#aa00aa'),
    brightMagenta: Color('#ff55ff'),
    cyan: Color('#00aaaa'),
    brightCyan: Color('#55ffff'),
    white: Color('#aaaaaa'),
    brightWhite: Color('#ffffff'),
  };
}

describe('SchemeExporters', () => {
  it('detects whether a full exportable color set is present', () => {
    const colors = createColors();

    expect(canExportScheme(colors)).toBe(true);
    expect(canExportScheme({
      ...colors,
      brightCyan: null,
    })).toBe(false);
  });

  it('builds every declared export format as a non-empty blob', async () => {
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    const colors = createColors();

    try {
      for (const definition of SCHEME_DOWNLOADS) {
        const blob = buildSchemeDownload(definition.id, colors);

        expect(blob.type).toBe(definition.mimeType);
        expect((await blob.text()).length).toBeGreaterThan(10);
      }
    } finally {
      dateNowSpy.mockRestore();
    }
  });

  it('generates the expected Xresources color slot mapping', async () => {
    const text = await buildSchemeDownload('xresources', createColors()).text();

    expect(text).toContain('*background: #101010');
    expect(text).toContain('*foreground: #F0F0F0');
    expect(text).toContain('*color0: #000000');
    expect(text).toContain('*color8: #808080');
    expect(text).toContain('*color1: #CC0000');
    expect(text).toContain('*color15: #FFFFFF');
  });

  it('generates an iTerm2 plist with the xml mime type', async () => {
    const blob = buildSchemeDownload('iTerm2', createColors());
    const text = await blob.text();

    expect(blob.type).toBe('application/xml;charset=utf-8');
    expect(text.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(text).toContain('<key>Background Color</key>');
    expect(text).toContain('<key>Ansi 0 Color</key>');
    expect(text).toContain('<key>Ansi 15 Color</key>');
  });

  it('converts RGB color hex to ConEmu BGR dword hex', () => {
    expect(bgrHex(Color('#112233'))).toBe('332211');
  });

  it('generates a ConEmu palette XML fragment', async () => {
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1519081200000);

    try {
      const blob = buildSchemeDownload('conEmu', createColors());
      const text = await blob.text();

      expect(blob.type).toBe('application/xml;charset=utf-8');
      expect(text).toContain('<key name="Palette1"');
      expect(text).toContain('<value name="ColorTable00" type="dword" data="00000000"/>');
      expect(text).toContain('<value name="ColorTable01" type="dword" data="00AA0000"/>');
      expect(text).toContain('<value name="ColorTable04" type="dword" data="000000CC"/>');
      expect(text).toContain('<value name="ColorTable15" type="dword" data="00FFFFFF"/>');
      expect(text).toContain('<value name="ColorTable31" type="dword" data="00ffffff"/>');
      expect(text).toMatchInlineSnapshot(`
        "<key name="Palette1" modified="2018-02-20 00:00:00" build="180131">
        	<value name="Name" type="string" data="4bit generated 1519081200" />
        	<value name="ExtendColors" type="hex" data="00" />
        	<value name="ExtendColorIdx" type="hex" data="0E" />
        	<value name="TextColorIdx" type="hex" data="10"/>
        	<value name="BackColorIdx" type="hex" data="10"/>
        	<value name="PopTextColorIdx" type="hex" data="10"/>
        	<value name="PopBackColorIdx" type="hex" data="10"/>
        	<value name="ColorTable00" type="dword" data="00000000"/>
        	<value name="ColorTable01" type="dword" data="00AA0000"/>
        	<value name="ColorTable02" type="dword" data="0000AA00"/>
        	<value name="ColorTable03" type="dword" data="00AAAA00"/>
        	<value name="ColorTable04" type="dword" data="000000CC"/>
        	<value name="ColorTable05" type="dword" data="00AA00AA"/>
        	<value name="ColorTable06" type="dword" data="000055AA"/>
        	<value name="ColorTable07" type="dword" data="00AAAAAA"/>
        	<value name="ColorTable08" type="dword" data="00808080"/>
        	<value name="ColorTable09" type="dword" data="00FF5555"/>
        	<value name="ColorTable10" type="dword" data="0055FF55"/>
        	<value name="ColorTable11" type="dword" data="00FFFF55"/>
        	<value name="ColorTable12" type="dword" data="005555FF"/>
        	<value name="ColorTable13" type="dword" data="00FF55FF"/>
        	<value name="ColorTable14" type="dword" data="0055FFFF"/>
        	<value name="ColorTable15" type="dword" data="00FFFFFF"/>
        	<value name="ColorTable16" type="dword" data="00000000"/>
        	<value name="ColorTable17" type="dword" data="00800000"/>
        	<value name="ColorTable18" type="dword" data="00008000"/>
        	<value name="ColorTable19" type="dword" data="00808000"/>
        	<value name="ColorTable20" type="dword" data="00000080"/>
        	<value name="ColorTable21" type="dword" data="00800080"/>
        	<value name="ColorTable22" type="dword" data="00008080"/>
        	<value name="ColorTable23" type="dword" data="00c0c0c0"/>
        	<value name="ColorTable24" type="dword" data="00808080"/>
        	<value name="ColorTable25" type="dword" data="00ff0000"/>
        	<value name="ColorTable26" type="dword" data="0000ff00"/>
        	<value name="ColorTable27" type="dword" data="00ffff00"/>
        	<value name="ColorTable28" type="dword" data="000000ff"/>
        	<value name="ColorTable29" type="dword" data="00ff00ff"/>
        	<value name="ColorTable30" type="dword" data="0000ffff"/>
        	<value name="ColorTable31" type="dword" data="00ffffff"/>
        </key>"
      `);
    } finally {
      dateNowSpy.mockRestore();
    }
  });

  it('generates a GNOME Terminal dconf script for the default profile', async () => {
    const text = await buildSchemeDownload('gnomeTerminal', createColors()).text();

    expect(text).toContain('gsettings get org.gnome.Terminal.ProfilesList default');
    expect(text).toContain('PROFILE_PATH="/org/gnome/terminal/legacy/profiles:/:${PROFILE_ID}/"');
    expect(text).toContain('dconf write "${PROFILE_PATH}use-theme-colors" false');
    expect(text).toContain('dconf write "${PROFILE_PATH}background-color" "\'#101010\'"');
    expect(text).toContain('dconf write "${PROFILE_PATH}foreground-color" "\'#F0F0F0\'"');
    expect(text).toContain(
      'dconf write "${PROFILE_PATH}palette" "[\'#000000\', \'#CC0000\', \'#00AA00\', \'#AA5500\', \'#0000AA\', \'#AA00AA\', \'#00AAAA\', \'#AAAAAA\', \'#808080\', \'#FF5555\', \'#55FF55\', \'#FFFF55\', \'#5555FF\', \'#FF55FF\', \'#55FFFF\', \'#FFFFFF\']"'
    );
    expect(text).not.toContain('gconftool-2');
    expect(text).not.toContain('/apps/gnome-terminal/profiles/Default');
  });

  it('generates the terminator palette in normal-then-bright order', async () => {
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(42);

    try {
      const text = await buildSchemeDownload('terminator', createColors()).text();

      expect(text).toContain('[[4bit-42]]');
      expect(text).toContain(
        'palette = "#000000:#CC0000:#00AA00:#AA5500:#0000AA:#AA00AA:#00AAAA:#AAAAAA:#808080:#FF5555:#55FF55:#FFFF55:#5555FF:#FF55FF:#55FFFF:#FFFFFF"'
      );
    } finally {
      dateNowSpy.mockRestore();
    }
  });

  it('generates a Termite colors section', async () => {
    const text = await buildSchemeDownload('termite', createColors()).text();

    expect(text).toContain('[colors]\n');
    expect(text).toContain('foreground = #F0F0F0');
    expect(text).toContain('background = #101010');
    expect(text).toContain('cursor = #F0F0F0');
    expect(text).toContain('cursor_foreground = #101010');
    expect(text).toContain('color0 = #000000');
    expect(text).toContain('color8 = #808080');
    expect(text).toContain('color15 = #FFFFFF');
  });

  it('generates a Windows Terminal JSON scheme', async () => {
    const blob = buildSchemeDownload('windowsTerminal', createColors());
    const scheme = JSON.parse(await blob.text());
    const terminalColorKeys = [
      'black',
      'red',
      'green',
      'yellow',
      'blue',
      'purple',
      'cyan',
      'white',
      'brightBlack',
      'brightRed',
      'brightGreen',
      'brightYellow',
      'brightBlue',
      'brightPurple',
      'brightCyan',
      'brightWhite',
    ];

    expect(blob.type).toBe('application/json;charset=utf-8');
    expect(scheme.name).toBe('4bit');
    expect(scheme.background).toBe('#101010');
    expect(scheme.foreground).toBe('#F0F0F0');
    expect(scheme.cursorColor).toBe('#F0F0F0');
    expect(scheme.selectionBackground).toBe('#808080');
    expect(scheme.purple).toBe('#AA00AA');
    expect(scheme.brightPurple).toBe('#FF55FF');

    terminalColorKeys.forEach((key) => {
      expect(scheme[key]).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  it('throws for unknown export formats', () => {
    expect(() => buildSchemeDownload('unknown-format', createColors())).toThrow(
      'Unknown export format: unknown-format'
    );
  });
});
