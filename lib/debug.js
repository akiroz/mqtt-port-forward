"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugEnabled = exports.debug = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (t, msg) => (0, _debug2.default)(`mqtt-socket-tunnel:${t}`)(msg);

exports.debug = debug;

const debugEnabled = t => _debug2.default.enabled(`mqtt-socket-tunnel:${t}`);

exports.debugEnabled = debugEnabled;