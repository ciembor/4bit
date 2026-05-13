export function asciiBytes(value) {
  return new Uint8Array([...value].map((character) => character.charCodeAt(0)));
}

export function bytesToAscii(bytes) {
  return String.fromCharCode(...bytes);
}

export function bytesToBase64(bytes) {
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}
