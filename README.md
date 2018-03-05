[![Build Status](https://travis-ci.org/dirkschumacher/nodepicosat.svg?branch=master)](https://travis-ci.org/dirkschumacher/nodepicosat)
[![npm version](https://img.shields.io/npm/v/picosat.svg)](https://www.npmjs.com/package/picosat)

# picosat for node

Node bindings to the [PicoSAT solver release 965](http://fmv.jku.at/picosat/) by Armin Biere. The PicoSAT C code is distributed under a MIT style license and is bundled with this package.

## Install

```
npm install picosat
```

## Example


Suppose we want to test the following formula for satisfiability:

(*A* ⇒ *B*)∧(*B* ⇒ *C*)∧(*C* ⇒ *A*)

This can be formulated as a CNF (conjunctive normal form):

(¬*A* ∨ *B*)∧(¬*B* ∨ *C*)∧(¬*C* ∨ *A*)

In `picosat` the problem is encoded as an array of integer arrays. Each positive, non-zero integer represents a literal. Negative integers are negated literals (e.g. not A).

```js
const formula = [[-1, 2], [-2, 3], [-3, 1]]
```
Having encoded the above formula, we can pass it to picosat.

```js
const picosat_sat = require("picosat")
const res = picosat_sat(formula)
console.log(res)
```

The result is an object:

```js
{
  statusCode: <string>, // SATISFIABLE, UNSATISFIABLE, UNKNOWN
  solution: <Array int> // an integer array with a positive or negative value for each variable. Negative values means false, positive true.
}
```

We can also test for satisfiability if we assume that a certain variable is `TRUE` or `FALSE`

```js
console.log(picosat_sat(formula, [1])) // assume A is TRUE
```

```js
console.log(picosat_sat(formula, [1, -3])) // assume A is TRUE, but C is FALSE
```

## License

This package is licensed under MIT. The PicoSAT solver bundled in this package is licensed MIT as well: Copyright (c) Armin Biere, Johannes Kepler University.
