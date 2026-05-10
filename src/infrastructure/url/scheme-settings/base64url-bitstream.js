const BASE64URL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export class BitWriter {
  constructor() {
    this.bytes = [];
    this.currentByte = 0;
    this.bitCount = 0;
  }

  write(value, width) {
    for (let index = width - 1; index >= 0; index -= 1) {
      this.currentByte = (this.currentByte << 1) | ((value >> index) & 1);
      this.bitCount += 1;

      if (this.bitCount === 8) {
        this.bytes.push(this.currentByte);
        this.currentByte = 0;
        this.bitCount = 0;
      }
    }
  }

  finish() {
    if (this.bitCount > 0) {
      this.bytes.push(this.currentByte << (8 - this.bitCount));
    }

    return this.bytes;
  }
}

export class BitReader {
  constructor(bytes) {
    this.bytes = bytes;
    this.byteIndex = 0;
    this.bitIndex = 0;
  }

  read(width) {
    let value = 0;

    for (let index = 0; index < width; index += 1) {
      if (this.byteIndex >= this.bytes.length) {
        return null;
      }

      value = (value << 1) | ((this.bytes[this.byteIndex] >> (7 - this.bitIndex)) & 1);
      this.bitIndex += 1;

      if (this.bitIndex === 8) {
        this.byteIndex += 1;
        this.bitIndex = 0;
      }
    }

    return value;
  }
}

export function bytesToBase64Url(bytes) {
  let out = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const hasSecond = index + 1 < bytes.length;
    const hasThird = index + 2 < bytes.length;
    const second = hasSecond ? bytes[index + 1] : 0;
    const third = hasThird ? bytes[index + 2] : 0;
    const bits = (first << 16) | (second << 8) | third;

    out += BASE64URL_ALPHABET[(bits >> 18) & 63];
    out += BASE64URL_ALPHABET[(bits >> 12) & 63];

    if (hasSecond) {
      out += BASE64URL_ALPHABET[(bits >> 6) & 63];
    }

    if (hasThird) {
      out += BASE64URL_ALPHABET[bits & 63];
    }
  }

  return out;
}

export function base64UrlToBytes(value) {
  let buffer = 0;
  let bitCount = 0;
  const bytes = [];

  for (const char of value) {
    const digit = BASE64URL_ALPHABET.indexOf(char);

    if (digit < 0) {
      return null;
    }

    buffer = (buffer << 6) | digit;
    bitCount += 6;

    while (bitCount >= 8) {
      bitCount -= 8;
      bytes.push((buffer >> bitCount) & 255);
    }

    buffer = bitCount > 0 ? buffer & ((1 << bitCount) - 1) : 0;
  }

  return bytes;
}
