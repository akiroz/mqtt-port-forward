"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncBy = syncBy;
exports.syncByComp = syncByComp;
exports.syncValue = syncValue;
exports.asyncBy = asyncBy;
exports.asyncByComp = asyncByComp;
exports.asyncValue = asyncValue;

function syncBy(c, source, fn) {
  let currentMin;
  let currentItem;

  for (const item of source) if (currentItem === undefined) {
    currentItem = item;
    currentMin = fn(item);
  } else {
    const m = fn(item);

    if (c(currentMin, m)) {
      currentMin = m;
      currentItem = item;
    }
  }

  return currentItem;
}

function syncByComp(c, source, fn) {
  let currentItem;

  for (const item of source) if (currentItem === undefined) currentItem = item;else if (c(fn(item, currentItem))) currentItem = item;

  return currentItem;
}

function syncValue(c, source) {
  let currentItem;

  for (const item of source) if (currentItem === undefined) currentItem = item;else if (c(currentItem, item)) currentItem = item;

  return currentItem;
}

async function asyncBy(c, source, fn) {
  let currentMin;
  let currentItem;

  for await (const item of source) if (currentItem === undefined) {
    currentItem = item;
    currentMin = await fn(item);
  } else {
    const m = await fn(item);

    if (c(currentMin, m)) {
      currentMin = m;
      currentItem = item;
    }
  }

  return currentItem;
}

async function asyncByComp(c, source, fn) {
  let currentItem;

  for await (const item of source) if (currentItem === undefined) currentItem = item;else if (await c(fn(item, currentItem))) currentItem = item;

  return currentItem;
}

async function asyncValue(c, source) {
  let currentItem;

  for await (const item of source) if (currentItem === undefined) currentItem = item;else if (c(currentItem, item)) currentItem = item;

  return currentItem;
}