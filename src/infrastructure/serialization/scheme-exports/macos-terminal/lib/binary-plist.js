import { asciiBytes } from './byte-strings';

export class BinaryPlistData {
  constructor(bytes) {
    this.bytes = bytes;
  }
}

export class BinaryPlistUid {
  constructor(value) {
    this.value = value;
  }
}

function concatBytes(parts) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const bytes = new Uint8Array(length);
  let offset = 0;

  parts.forEach((part) => {
    bytes.set(part, offset);
    offset += part.length;
  });

  return bytes;
}

function minimumByteSize(value) {
  if (value <= 0xff) {
    return 1;
  }

  if (value <= 0xffff) {
    return 2;
  }

  if (value <= 0xffffffff) {
    return 4;
  }

  return 8;
}

function integerBytes(value, byteSize = minimumByteSize(value)) {
  const bytes = new Uint8Array(byteSize);
  let remaining = BigInt(value);

  for (let index = byteSize - 1; index >= 0; index -= 1) {
    bytes[index] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }

  return bytes;
}

function markerWithLength(marker, length) {
  if (length < 15) {
    return new Uint8Array([marker | length]);
  }

  const lengthBytes = integerBytes(length);
  const intMarker = 0x10 | Math.log2(lengthBytes.length);

  return concatBytes([
    new Uint8Array([marker | 0x0f, intMarker]),
    lengthBytes,
  ]);
}

function isScalar(value) {
  return value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    value instanceof BinaryPlistData ||
    value instanceof BinaryPlistUid;
}

function flattenObject(value, objects) {
  const index = objects.length;
  objects.push(value);

  if (isScalar(value)) {
    return index;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenObject(item, objects));
    return index;
  }

  Object.keys(value).forEach((key) => {
    flattenObject(key, objects);
    flattenObject(value[key], objects);
  });

  return index;
}

function objectReference(index, objectRefSize) {
  return integerBytes(index, objectRefSize);
}

function encodeScalar(value) {
  if (value === null) {
    return new Uint8Array([0x00]);
  }

  if (typeof value === 'number') {
    const bytes = integerBytes(value);
    return concatBytes([new Uint8Array([0x10 | Math.log2(bytes.length)]), bytes]);
  }

  if (typeof value === 'string') {
    const bytes = asciiBytes(value);
    return concatBytes([markerWithLength(0x50, bytes.length), bytes]);
  }

  if (value instanceof BinaryPlistData) {
    return concatBytes([markerWithLength(0x40, value.bytes.length), value.bytes]);
  }

  const bytes = integerBytes(value.value);
  return concatBytes([new Uint8Array([0x80 | (bytes.length - 1)]), bytes]);
}

function encodeObject(value, objectIndexes, objectRefSize) {
  if (isScalar(value)) {
    return encodeScalar(value);
  }

  if (Array.isArray(value)) {
    const references = value.map((item) => objectReference(objectIndexes.get(item), objectRefSize));

    return concatBytes([markerWithLength(0xa0, value.length), ...references]);
  }

  const keys = Object.keys(value);
  const keyReferences = keys.map((key) => objectReference(objectIndexes.get(key), objectRefSize));
  const valueReferences = keys.map((key) => objectReference(objectIndexes.get(value[key]), objectRefSize));

  return concatBytes([markerWithLength(0xd0, keys.length), ...keyReferences, ...valueReferences]);
}

function buildObjectIndexMap(objects) {
  const objectIndexes = new Map();

  objects.forEach((object, index) => {
    objectIndexes.set(object, index);
  });

  return objectIndexes;
}

function trailer(offsetIntSize, objectRefSize, objectCount, topObjectIndex, offsetTableOffset) {
  return concatBytes([
    new Uint8Array(6),
    new Uint8Array([offsetIntSize, objectRefSize]),
    integerBytes(objectCount, 8),
    integerBytes(topObjectIndex, 8),
    integerBytes(offsetTableOffset, 8),
  ]);
}

export function encodeBinaryPlist(value) {
  const objects = [];
  const topObjectIndex = flattenObject(value, objects);
  const objectRefSize = minimumByteSize(objects.length - 1);
  const objectIndexes = buildObjectIndexMap(objects);
  const header = asciiBytes('bplist00');
  const offsets = [];
  const encodedObjects = [];
  let offset = header.length;

  objects.forEach((object) => {
    const encodedObject = encodeObject(object, objectIndexes, objectRefSize);

    offsets.push(offset);
    encodedObjects.push(encodedObject);
    offset += encodedObject.length;
  });

  const offsetIntSize = minimumByteSize(offset);
  const offsetTableOffset = offset;
  const offsetTable = concatBytes(offsets.map((item) => integerBytes(item, offsetIntSize)));

  return concatBytes([
    header,
    ...encodedObjects,
    offsetTable,
    trailer(offsetIntSize, objectRefSize, objects.length, topObjectIndex, offsetTableOffset),
  ]);
}
