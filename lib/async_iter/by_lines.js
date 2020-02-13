"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.byLines = void 0;

var _get_iterator = require("./lib/get_iterator");

const byLines = (0, _get_iterator.syncType)(syncByLines, asyncByLines);
exports.byLines = byLines;

function getPotentialLines() {
  const fn = item => {
    const potentialLines = item.split('\n');
    potentialLines[0] = fn.currentLine ? `${fn.currentLine}${potentialLines[0]}` : potentialLines[0];
    fn.currentLine = potentialLines.pop();
    if (fn.currentLine === '\n') fn.currentLine = undefined;
    return potentialLines;
  };

  fn.currentLine = undefined;
  return fn;
}

function* syncByLines(source) {
  const potentialLinesFrom = getPotentialLines();

  for (const item of source) for (const potentialLine of potentialLinesFrom(item)) yield potentialLine;

  if (potentialLinesFrom.currentLine !== undefined) yield potentialLinesFrom.currentLine;
}

async function* asyncByLines(source) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  const potentialLinesFrom = getPotentialLines();

  for await (const item of source) for (const potentialLine of potentialLinesFrom(item)) yield potentialLine;

  if (potentialLinesFrom.currentLine !== undefined) yield potentialLinesFrom.currentLine;
}