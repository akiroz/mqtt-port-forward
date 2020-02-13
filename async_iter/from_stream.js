"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromStream = fromStream;

var _pump = require("./pump");

async function parcelArguments(target, args) {
  if (args.length === 0) await target.next();else if (args.length === 1) await target.next(args[0]);else await target.next(args);
}
/**
```
import {fromStream} from 'async_iter/pipeline/from_stream' # pipeline version
import {fromStream} from 'async_iter/from_stream' # conventional version
```
 * Returns an iterator, that emits as per the <code>dataEvent</code> of the <code>eventSource</code>
 * @param  {EventEmitter} eventSource   An object that supports the <code>on</code> and <code>removeListener</code> function
 * @param  {String} [dataEvent=data]    The main dataEvent name to listen to
 * @param  {String} [closeEvent=close]  When this event emits, the iteration is stopped
 * @return {iteration}                  An iterable source
 * @function
 * @memberof module:Generators
 * @name fromStream
 */


function fromStream(eventSource, dataEvent = 'data', closeEvent = 'close') {
  return (0, _pump.pump)(async (target, hasStopped) => {
    await target.next();

    async function listener(...args) {
      if (eventSource.pause) eventSource.pause();
      await parcelArguments(target, args);
      if (eventSource.resume) eventSource.resume();
    }

    async function closeListener() {
      target.return();
    }

    eventSource.on(dataEvent, listener);
    eventSource.on(closeEvent, closeListener);
    hasStopped.then(() => {
      eventSource.removeListener(dataEvent, listener);
      eventSource.removeListener(closeEvent, closeListener);
    });
  });
}