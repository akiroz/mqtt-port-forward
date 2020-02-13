"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delay = delay;

var _get_iterator = require("./lib/get_iterator");

const delayPromise = period => new Promise(res => setTimeout(res, period));
/**
```
import {delay} from 'async_iter/pipeline/delay' # pipeline version
import {delay} from 'async_iter/delay' # conventional version
```

Re-emits all values from source, with a time delay between each item

 * @param  {Iterable}         source        The source iteration
 * @param {Number} period The time in miliiseconds to pause between each item
 * @return {Iterable} The delayed iterable items
 * @function
 * @name delay
 * @memberof module:Operators
*/


async function* delay(source, period) {
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const item of source) {
    await delayPromise(period);
    yield item;
  }
}