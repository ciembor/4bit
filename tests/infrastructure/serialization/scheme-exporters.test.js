import { describe, expect, it, vi } from 'vitest';
import Color from 'color';
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

  it('throws for unknown export formats', () => {
    expect(() => buildSchemeDownload('unknown-format', createColors())).toThrow(
      'Unknown export format: unknown-format'
    );
  });
});
