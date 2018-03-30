# picosat for node

**Node bindings to the [PicoSAT solver release 965](http://fmv.jku.at/picosat/) by Armin Biere.** The PicoSAT C code is distributed under a MIT style license and is bundled with this package.

[![Build Status](https://travis-ci.org/dirkschumacher/nodepicosat.svg?branch=master)](https://travis-ci.org/dirkschumacher/nodepicosat)
[![npm version](https://img.shields.io/npm/v/picosat.svg)](https://www.npmjs.com/package/picosat)

## Install

```
npm install picosat
```

## Example

Suppose we want to test the following formula for satisfiability:

(*A* ⇒ *B*)∧(*B* ⇒ *C*)∧(*C* ⇒ *A*)

This can be formulated as a CNF (conjunctive normal form):

(¬*A* ∨ *B*)∧(¬*B* ∨ *C*)∧(¬*C* ∨ *A*)

This library expects the following equivalent notation:

```js
const fomula = [
  ['!A', 'B'],
  ['!B', 'C'],
  ['!C', 'A']
]

const {solveWithStrings} = require('picosat')
console.log(solveWithStrings(formula))
```

The result is an object:

```js
{
  satisfiable: true,
  statusCode: 'satisfiable', // may also be 'unsatisfiable' or 'unknown'
  solution: [ // negative values means false, positive true.
    -1, // A
    -2, // B
    -3 // C
  ]
}
```

We can also test for satisfiability assuming that a certain variable is true or false:

```js
const assumptions = [
  'A', // assume A is true
  '!C', // assume C is false
]
solveWithStrings(formula, assumptions)
```

## Integer interface

If you want to use integers to define the input, like other PicoSAT bindings in other languages expect it ([`rpicosat`](https://github.com/dirkschumacher/rpicosat#example), [`pycosat`](https://github.com/ContinuumIO/pycosat#example)), you can use `solve`.

```js
const solve = require('picosat')

const fomula = [
  [-1, 2], // !A, B
  [-2, 3], // !B, C
  [-3, 1] // !C, A
]
const assumptions = [
  -1 // assume A is false
]

const result = solve(formula, assumptions)
console.log('status code', result[0])
console.log('solution', result.slice(1))
```

```
statusCode 10 // 10: satisfiable, 20: unsatisfiable, otherwise unknown
solution [
  -1, // A
  -2, // B
  -3 // C
]
```

## Low-level interface

This package also provides a low-level interface that works directly on [`Buffer`s](https://nodejs.org/api/buffer.html), without encoding into/decoding from the format that *PicoSAT* works on:

```js
const encodeInt32Array = require('picosat/lib/encode')
const {solveUnsafe} = require('picosat')

const encodedFomula = encodeInt32Array([
  -1, 2, // !A, B
  0, // separator
  -2, 3, // !B, C
  0, // separator
  -3, 1, // !C, A
  0 // separator
])
const encodedAssumptions = encodeInt32Array([
  -1 // assume A is false
])

const result = solveUnsafe(encodedFormula, encodedAssumptions)
console.log('status code', result[0])
console.log('solution', result.slice(1))
```

```
statusCode 10 // 10: satisfiable, 20: unsatisfiable, otherwise unknown
solution [
  -1, // A
  -2, // B
  -3 // C
]
```

## License

This package is licensed under MIT.

The PicoSAT solver bundled with this package is licensed under MIT as well: Copyright (c) Armin Biere, Johannes Kepler University.
