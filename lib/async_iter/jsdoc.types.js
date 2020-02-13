/**
 * Called by the filter function, when a set of items are filtered
 *
 * @callback reducerCallback
 * @param {*} accumulator - the current accumulator value (result of previous call)
 * @param {*} item - the current item to be processed
 * @param {Number} index - the index of the item within the iteration
 * @return {*} the new accumulator value
 */

/**
 * Called by the min and max operators to identify comparison value or ordering.
 *
 * There are 2 forms of this function.  If the function takes only 1 argument, it
 * is assume that the function returns a string or number to be used for comparison.
 *
 * If the function takes 2 arguments, then it must compare the 2 arguments and return
 * -1 if less than, 0 if equal, and +1 is greater.
 *
 * @callback minMaxCallback
 * @param {*} item to be considered for sequence
 * @param {*=} comparisonItem - an item to be compared to the first item
 * @return {*} a value to be compared, or -1, 0, +1 to indicate comparison
 */

/**
 * Called by the filter function, when a set of items are filtered
 *
 * @callback missingValueFn
 * @param {*} filteredItem - the first filtered item
 * @param {*} nonFilteredItem - the first non filtered item
 * @return {*} a value to be emitted before the nonFilteredItem
 */

/**
 * A function that receives the items of an iterable
 *
 * @callback itemCallback
 * @param {*} value - the value of the current source item
 * @param {Number} index the index of the item as per the source iteration
 */

/**
 * Evaluate the supplied item returning a boolean
 *
 * @callback itemTest
 * @param {*} value - the value of the current source item
 * @param {Number} index the index of the item as per the source iteration
 * @return {boolean}
 */

/**
 * Evaluate the supplied item returning a boolean
 *
 * @callback evaluateItem
 * @param {*} value - the value of the current source item
 * @return {boolean}
 */

/**
 * Indicate if a batched buffer iteration should be emitted
 *
 * @callback triggerCallback
 * @param {*} value - the value of the current source item
 * @param {Array} currentBatch the current array of collected items - the last item will be `value`
 * @return {boolean} Returning true indicate that item can be emitted
 */

/**
 * Callback to get description of an overflow event.
 * @callback overFlowEventCallback
 * @return {*} The item to emit when we persistent buffer overflows.  If underfined no overflow event will be emitted
 */

/**
 * @typedef PersistedItem
 * @type {object}
 * @property {string} value - the emitted value from the persisted store as a <code>Buffer</code> (ie: you may need to apply, toString())
 * @property {Function} completed - A function that must be called to removed the item
 */

/**
 * The callback function invoked to generate an push based async iterator
 *
 * @callback pumpCallback
 * @param {iterator} target - The target iterator object (supports next, return and throw)
> * target.next - call this function to push a value into the iteration - returns a promise when the consumer
has consumed this item.  Returns a promise that resolves to `{value, done}`
> * target.return - call this function when there are no more items to be pushed.  Signal to consumer that
the iteration has completed
> * target.throw - call this function when an error has been generated - raises the error within the consuming
iteration
 * @param {promise} hasStopped - a promise that resolves, when the consumer has stopped iterating.  This is an alternative
mechanism to identify a stopped iteration
> * `hasStopped.now()` - promise additonally supports a now() that returns true, when the consumer has stopped iterating
 */
"use strict";