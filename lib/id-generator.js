"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateId = generateId;

var _v = _interopRequireDefault(require("uuid/v4"));

var _bs = _interopRequireDefault(require("bs58"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateId() {
  const guid = (0, _v.default)().replace(/-/g, '');

  const r = _bs.default.encode(Buffer.from(guid, 'hex'));

  return r.slice(0, r.length - 2);
}