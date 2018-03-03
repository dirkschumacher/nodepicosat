"use strict"
const bindings = require('node-gyp-build')(__dirname)

const isValidFormula = (formula) => {
  return Array.isArray(formula) &&
         formula.length > 0 &&
         formula.every((arr) => {
           return Array.isArray(arr) &&
                  arr.every(Number.isInteger) &&
                  arr.every(x => x != 0)
         })
}

const convertFormulaToPicosat = (formula) => {
  return formula.reduce((acc, el) => {
    return acc.concat(el).concat([0])
  }, [])
}

const isValidAssumptions = (assumptions, nvars) => {
  // TODO: check for duplicates
  return Array.isArray(assumptions) &&
         assumptions.every(Number.isInteger) &&
         assumptions.every(x => x >= 1 && x <= nvars)
}

const picosat_sat = (formula, assumptions) => {
  if (!isValidFormula(formula)) {
    throw "Your formula is not valid. Please use an array of arrays of integers"
  }
  const picosatInput = convertFormulaToPicosat(formula)
  const nVariables = Math.max(...picosatInput.map(Math.abs))

  let assumptionsBuffer
  if (assumptions) {
    if (!isValidAssumptions(assumptions, nVariables)) {
      throw "Your assumptions are not valid. Need to be an array of integers"
    }
    assumptionsBuffer = Buffer.from(assumptions)
  } else {
    assumptionsBuffer = Buffer.from([])
  }

  const solution = bindings.node_picosat_sat(
    Buffer.from(picosatInput),
    assumptionsBuffer
  )

  return {
    satisfiable: solution.length > 0,
    solution
  }
}

module.exports = picosat_sat
