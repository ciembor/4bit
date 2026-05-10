import { describe, expect, it } from 'vitest';
import Color from 'color';
import {
  buildMinttyDragSchemeHash,
  MINTTY_DRAG_SCHEME_COLOR_ORDER,
  serializeMinttyDragScheme,
} from '../../../src/infrastructure/url/mintty-drag-scheme';

const EXPECTED_SCHEME_VALUES = [
  '101010',
  'F0F0F0',
  'F0F0F0',
  '000000',
  'CC0000',
  '00AA00',
  'AA5500',
  '0000AA',
  'AA00AA',
  '00AAAA',
  'AAAAAA',
  '808080',
  'FF5555',
  '55FF55',
  'FFFF55',
  '5555FF',
  'FF55FF',
  '55FFFF',
  'FFFFFF',
];
const EXPECTED_SCHEME = EXPECTED_SCHEME_VALUES.join(':');

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

describe('mintty-drag-scheme', () => {
  it('documents the compact URL color order', () => {
    expect(MINTTY_DRAG_SCHEME_COLOR_ORDER).toEqual([
      'background',
      'foreground',
      'cursor',
      'black',
      'red',
      'green',
      'yellow',
      'blue',
      'magenta',
      'cyan',
      'white',
      'brightBlack',
      'brightRed',
      'brightGreen',
      'brightYellow',
      'brightBlue',
      'brightMagenta',
      'brightCyan',
      'brightWhite',
    ]);
  });

  it('serializes the full mintty drag-and-drop scheme as uppercase hex values', () => {
    const scheme = serializeMinttyDragScheme(createColors());

    expect(scheme).toBe(EXPECTED_SCHEME);
  });

  it('can use an explicit cursor color when one is available', () => {
    const scheme = serializeMinttyDragScheme({
      ...createColors(),
      cursor: Color('#123456'),
    });

    expect(scheme.split(':')[2]).toBe('123456');
  });

  it('builds the hash payload expected by mintty link drag-and-drop', () => {
    expect(buildMinttyDragSchemeHash(createColors())).toBe(`#?scheme=${EXPECTED_SCHEME}`);
  });

  it('returns an empty payload until the calculated color set is complete', () => {
    expect(serializeMinttyDragScheme({
      ...createColors(),
      brightWhite: null,
    })).toBe('');
    expect(buildMinttyDragSchemeHash(null)).toBe('');
  });
});
