"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delayUntil = delayUntil;

const delayPromise = period => new Promise(res => setTimeout(res, period));
/**
```
import {delayUntil} from 'async_iter/pipeline/delay_until' # pipeline version
import {delayUntil} from 'async_iter/delay_until' # conventional version
```

Waits for the specific time point, and then re-emits the source items

 * @param  {Iterable}         source        The source iteration
 * @param {date} Date The timepoint to wait until the source iterations is returned.
 * @return {Iterable} The delayed iterable
 * @function
 * @name delayUntil
 * @memberof module:Operators
*/


async function delayUntil(source, date) {
  date = new Date(date);
  await delayPromise(date.getTime() - Date.now());
  return source;
}