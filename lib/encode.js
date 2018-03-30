'use strict'

const os = require('os')

const endianness = os.endianness()

let encodeInt32Array = () => {
  throw('unsupported endianness ' + endianness)
}
if (endianness === 'BE') {
  encodeInt32Array = (arr) => {
    const buf = Buffer.alloc(arr.length * 4)
    for (let i = 0, j = 0; i < arr.length; i++) {
      j = buf.writeInt32BE(arr[i], j)
    }
    return buf
  }
} else if (endianness === 'LE') {
  encodeInt32Array = (arr) => {
    const buf = Buffer.alloc(arr.length * 4)
    for (let i = 0, j = 0; i < arr.length; i++) {
      j = buf.writeInt32LE(arr[i], j)
    }
    return buf
  }
}

module.exports = encodeInt32Array
