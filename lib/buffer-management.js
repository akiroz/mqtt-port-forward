"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyHeader = applyHeader;
exports.extractHeader = extractHeader;
exports.PacketCodes = void 0;
const PacketCodes = Object.freeze({
  Connect: 1,
  Data: 2,
  End: 3,
  Close: 4,
  Ack: 5,
  Terminate: -1
});
exports.PacketCodes = PacketCodes;

function applyHeader(buffer, code, packetNumber) {
  const header = Buffer.alloc(8);
  header.writeInt32BE(code, 0);
  header.writeInt32BE(packetNumber, 4);
  return Buffer.concat([header, buffer]);
}

function extractHeader(buffer) {
  const code = buffer.readInt32BE(0);
  const packetNumber = buffer.readInt32BE(4);
  const data = buffer.slice(8);
  return {
    code,
    packetNumber,
    data
  };
}