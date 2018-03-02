# nodepicosat
[work in progress]: SAT solver picosat for javascript



## Example

```js
const picosat_sat = require("picosat")
const formula = [1, 2, 0, -1, 2, 0]
const assumptions = [1]

// satisfiable
console.log(picosat_sat(formula, assumptions))
console.log(picosat_sat(formula, []))

// not satisfiable => empty array
console.log(picosat_sat([1, 0, -1, 0], []))
```
