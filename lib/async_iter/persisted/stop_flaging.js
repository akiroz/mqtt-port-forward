"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flagAsStop = flagAsStop;
exports.unflagAsStop = unflagAsStop;
exports.hasStoppedFlag = hasStoppedFlag;

var _path = require("path");

var _fs2 = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = _fs2.default.promises;

async function flagAsStop(storeDirectory) {
  await fs.writeFile((0, _path.join)(storeDirectory, 'stopped'), '');
}

async function unflagAsStop(storeDirectory) {
  await fs.unlink((0, _path.join)(storeDirectory, 'stopped'));
}

async function hasStoppedFlag(storeDirectory) {
  return await fs.access((0, _path.join)(storeDirectory, 'stopped'), _fs2.default.constants.F_OK).then(() => true).catch(() => false);
}