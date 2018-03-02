# nodepicosat
[work in progress]: SAT solver picosat for javascript

[![Build Status](https://travis-ci.org/dirkschumacher/nodepicosat.svg?branch=master)](https://travis-ci.org/dirkschumacher/nodepicosat)

## Example

```js
const picosat_sat = require("picosat")
// (A OR B) AND (NOT A OR B)
const formula = [[1, 2], [-1, 2]]
const assumptions = [1]

// satisfiable
console.log(picosat_sat(formula, assumptions))
console.log(picosat_sat(formula))

// not satisfiable
// (A) AND (NOT A)
console.log(picosat_sat([[1], [-1]]))
```
