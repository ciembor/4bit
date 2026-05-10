import {
  base64UrlToBytes,
  BitReader,
  BitWriter,
  bytesToBase64Url,
} from './base64url-bitstream';
import { resolveSchemeColorMode } from './canonicalization';
import { hydrateSchemeSettings } from './mapper';
import {
  COLOR_MODE_PACKED_VALUES,
  DYE_SCOPE_PACKED_VALUES,
  PACKED_SCHEME_URL_SETTINGS_VERSION,
  SCHEME_DEGREE_COUNT,
  SPECIAL_COLOR_PACKED_VALUES,
} from './schema';

const PACKING_EPSILON = 1e-9;

function packedIndex(values, value) {
  const index = values.indexOf(value);

  return index >= 0 ? index : null;
}

function integerInRange(value, min, max) {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < min || numericValue > max) {
    return null;
  }

  return numericValue;
}

function scaledIntegerInRange(value, scale, min, max) {
  const numericValue = Number(value);
  const scaledValue = Math.round(numericValue * scale);

  if (
    !Number.isFinite(numericValue) ||
    Math.abs(numericValue - (scaledValue / scale)) > PACKING_EPSILON ||
    scaledValue < min ||
    scaledValue > max
  ) {
    return null;
  }

  return scaledValue;
}

class PackedSettingsWriter {
  constructor() {
    this.writer = new BitWriter();
    this.valid = true;
  }

  writeValue(values, value, width) {
    this.writeRequired(packedIndex(values, value), width);
  }

  writeInteger(value, width, min, max) {
    const packedValue = integerInRange(value, min, max);

    this.writeRequired(packedValue === null ? null : packedValue - min, width);
  }

  writeScaledInteger(value, width, scale, min, max) {
    const packedValue = scaledIntegerInRange(value, scale, min, max);

    this.writeRequired(packedValue === null ? null : packedValue - min, width);
  }

  writeDegrees(degrees) {
    if (!Array.isArray(degrees) || degrees.length !== SCHEME_DEGREE_COUNT) {
      this.valid = false;
      return;
    }

    degrees.forEach((degree) => this.writeInteger(degree, 9, 0, 359));
  }

  writeRequired(value, width) {
    if (value === null) {
      this.valid = false;
      return;
    }

    this.writer.write(value, width);
  }

  finish() {
    return this.valid ? bytesToBase64Url(this.writer.finish()) : null;
  }
}

class PackedSettingsReader {
  constructor(bytes) {
    this.reader = new BitReader(bytes);
  }

  readValue(values, width) {
    const index = this.reader.read(width);

    return index === null ? null : values[index] || null;
  }

  readInteger(width, min) {
    const value = this.reader.read(width);

    return value === null ? null : value + min;
  }

  readScaledInteger(width, scale, min) {
    const value = this.readInteger(width, min);

    return value === null ? null : value / scale;
  }

  readDegrees() {
    return Array.from({ length: SCHEME_DEGREE_COUNT }, () => this.readInteger(9, 0));
  }
}

function writePackedScheme(writer, scheme) {
  writer.writeValue(COLOR_MODE_PACKED_VALUES, resolveSchemeColorMode(scheme), 3);
  writer.writeInteger(scheme.hue, 9, -180, 180);
  writer.writeInteger(scheme.hueDistance, 6, 0, 45);
  writer.writeDegrees(scheme.degrees);
  writer.writeInteger(scheme.saturation, 7, 0, 100);
  writer.writeInteger(scheme.saturationRange, 6, 0, 50);
  writer.writeScaledInteger(scheme.normalChromaticLightness, 9, 2.56, 0, 256);
  writer.writeScaledInteger(scheme.brightChromaticLightness, 9, 2.56, 0, 256);
  writer.writeInteger(scheme.lightnessRange, 5, 0, 30);
  writer.writeScaledInteger(scheme.normalBlackLightness, 9, 2.56, 0, 256);
  writer.writeScaledInteger(scheme.brightBlackLightness, 9, 2.56, 0, 256);
  writer.writeScaledInteger(scheme.normalWhiteLightness, 9, 2.56, 0, 256);
  writer.writeScaledInteger(scheme.brightWhiteLightness, 9, 2.56, 0, 256);
  writer.writeValue(DYE_SCOPE_PACKED_VALUES, scheme.dyeScope, 2);
  writer.writeInteger(scheme.dyeColor.hue, 9, 0, 360);
  writer.writeScaledInteger(scheme.dyeColor.saturation, 14, 100, 0, 10000);
  writer.writeScaledInteger(scheme.dyeColor.lightness, 14, 100, 0, 10000);
  writer.writeScaledInteger(scheme.dyeColor.alpha, 7, 100, 0, 100);
  writer.writeValue(SPECIAL_COLOR_PACKED_VALUES, scheme.background, 3);
  writer.writeInteger(scheme.customBackgroundColor.hue, 9, 0, 360);
  writer.writeScaledInteger(scheme.customBackgroundColor.saturation, 14, 100, 0, 10000);
  writer.writeScaledInteger(scheme.customBackgroundColor.lightness, 14, 100, 0, 10000);
  writer.writeValue(SPECIAL_COLOR_PACKED_VALUES, scheme.foreground, 3);
  writer.writeInteger(scheme.customForegroundColor.hue, 9, 0, 360);
  writer.writeScaledInteger(scheme.customForegroundColor.saturation, 14, 100, 0, 10000);
  writer.writeScaledInteger(scheme.customForegroundColor.lightness, 14, 100, 0, 10000);
}

function readPackedScheme(reader) {
  return {
    colorMode: reader.readValue(COLOR_MODE_PACKED_VALUES, 3),
    hue: reader.readInteger(9, -180),
    hueDistance: reader.readInteger(6, 0),
    degrees: reader.readDegrees(),
    saturation: reader.readInteger(7, 0),
    saturationRange: reader.readInteger(6, 0),
    chromaticLightness: [
      reader.readScaledInteger(9, 2.56, 0),
      reader.readScaledInteger(9, 2.56, 0),
    ],
    lightnessRange: reader.readInteger(5, 0),
    blackLightness: [
      reader.readScaledInteger(9, 2.56, 0),
      reader.readScaledInteger(9, 2.56, 0),
    ],
    whiteLightness: [
      reader.readScaledInteger(9, 2.56, 0),
      reader.readScaledInteger(9, 2.56, 0),
    ],
    dyeScope: reader.readValue(DYE_SCOPE_PACKED_VALUES, 2),
    dyeColor: [
      reader.readInteger(9, 0),
      reader.readScaledInteger(14, 100, 0),
      reader.readScaledInteger(14, 100, 0),
      reader.readScaledInteger(7, 100, 0),
    ],
    background: reader.readValue(SPECIAL_COLOR_PACKED_VALUES, 3),
    customBackgroundColor: [
      reader.readInteger(9, 0),
      reader.readScaledInteger(14, 100, 0),
      reader.readScaledInteger(14, 100, 0),
    ],
    foreground: reader.readValue(SPECIAL_COLOR_PACKED_VALUES, 3),
    customForegroundColor: [
      reader.readInteger(9, 0),
      reader.readScaledInteger(14, 100, 0),
      reader.readScaledInteger(14, 100, 0),
    ],
  };
}

export function encodePackedSchemeUrlSettings(scheme) {
  const writer = new PackedSettingsWriter();

  writePackedScheme(writer, scheme);

  const payload = writer.finish();

  return payload ? `${PACKED_SCHEME_URL_SETTINGS_VERSION}${payload}` : null;
}

export function decodePackedSchemeUrlSettings(value) {
  const bytes = base64UrlToBytes(value);

  if (!bytes) {
    return null;
  }

  return hydrateSchemeSettings(readPackedScheme(new PackedSettingsReader(bytes)));
}
