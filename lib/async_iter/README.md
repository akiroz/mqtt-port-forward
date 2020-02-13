# async_iter
-----------------

[![Build Status](https://travis-ci.com/vipoo/async_iter.svg?branch=master)](https://travis-ci.com/vipoo/async_iter_persited)

A set of async generators and iterator functions

This project is me just experimenting and learning about async generators in javascript.

Its not supported or stable.

### Installing

`npm install async_iter`

## Overview

Below are the listed generators and functions implemented in this module.

Have a look at the [examples directory](https://github.com/vipoo/async_iter/tree/master/src/examples) for working examples

The module uses babel to target nodejs version 10.16.3.  It should be compatibile
with node 10 and above.

[API Docs](https://vipoo.github.io/async_iter/)

#### Async/Sync Iterator functions

* [broadcast](https://vipoo.github.io/async_iter/module-Operators.html#.broadcast)
* [bufferBy](https://vipoo.github.io/async_iter/module-Operators.html#.bufferBy)
* [bufferGroupBy](https://vipoo.github.io/async_iter/module-Operators.html#.bufferGroupBy)
* [byLines](https://vipoo.github.io/async_iter/module-Operators.html#.byLines)
* [chunk](https://vipoo.github.io/async_iter/module-Operators.html#.chunk)
* [combineWhen](https://vipoo.github.io/async_iter/module-Operators.html#.combineWhen)
* [count](https://https://vipoo.github.io/async_iter/module-Operators.html#.count)
* [map](https://vipoo.github.io/async_iter/module-Operators.html#.map)
* [persisted](https://vipoo.github.io/async_iter/module-Operators.html#.persisted)
* [rateLimit](https://vipoo.github.io/async_iter/module-Operators.html#.rateLimit)
* [take](https://vipoo.github.io/async_iter/module-Operators.html#.take)

#### Itertor generators

file:///home/dean/personal/async_iter/docs/module-Generators.html#.fromStream
* [fromStream](https://vipoo.github.io/async_iter/module-Generators.html#.fromStream)
* [interval](https://vipoo.github.io/async_iter/module-Generators.html#.interval)
* [pump](https://vipoo.github.io/async_iter/module-Generators.html#.pump)
* [range](https://vipoo.github.io/async_iter/module-Generators.html#.range)

### Importing function patterns

The operators come in 2 distinct flavours.  A standard form, and a form more suited for use with the |> pipeline operator.

#### Standard Form - All

The import path `async_iter` imports all operators.  Including non-browser compatible versions

eg: `import {map, filter, forEach} from 'async_iter'`

The function will typically take the form of `operator(source, ...)`.  Where source is a async or sync iterable

```
import {map} from 'async_iter'

const result = map([1, 2, 3, 4, 5], x => x * 2)

```

#### Standard Form - All browser compatible only

The import path `async_iter/browsers` imports all operators that are compatible with browsers - exludes nodejs specific operators.

eg: `import {map, filter, forEach} from 'async_iter/browsers'`

#### Standard Form - Direct

For each of the function, you can reduce the import set, by only including the specific functions you want.

eg: `import {map} from 'async_iter/map'`

#### Pipeline Form - All

The import path `async_iter/pipeline` imports all operators with a signature that aligns with pipelining.

eg: `import {map, filter, forEach} from 'async_iter/pipeline'`

The function will return a function that take a single source iterable argument.

For example, the map function take a single mapping function, and returns a new function `map = fn => source => {...}`.

```
import {map} from 'async_iter/pipeline'

[1, 2, 3, 4, 5] |> map(x => x * 2)
```

#### Pipeline Form - All browser compatible only

The import path `async_iter/pipeline/browsers` imports all operators compatible with browsers and exludes nodejs specific operators.

eg: `import {map, filter, forEach} from 'async_iter/pipeline/browsers'`

#### Pipeline Form - Direct

The paths `async_iter/pipeline/XXX` allows for the direct import of specific pipeline operators

eg:
```
import {map} from 'async_iter/pipeline/map'

[1, 2, 3, 4, 5] |> map(x => x * 2)
```
