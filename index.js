"use strict"
const bindings = require('node-gyp-build')(__dirname)


const picosat_sat = (formula, assumptions) => {

  // TODO: check input
  // TODO: return a proper javascript object
  const res = bindings.node_picosat_sat(
    Buffer.from(formula),
    Buffer.from(assumptions)
  )

  return {
    satisfiable: res.length > 0,
    solution: res
  }
}

module.exports = picosat_sat
