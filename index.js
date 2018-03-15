'use strict'

const bindings = require('node-gyp-build')(__dirname)

const encodeStrings = (formula, assumptions) => {
  if (!Array.isArray(formula)) throw new Error('formula must be an array.')
  if (!Array.isArray(assumptions)) throw new Error('assumptions must be an array.')
  if (formula.length === 0) {
    throw new Error('formula must have 1 or more clauses.')
  }

  const encodedFormula = []
  const variableToId = Object.create(null)
  let nextVariableId = 1

  for (let i = 0; i < formula.length; i++) {
    const clause = formula[i]
    if (!Array.isArray(clause)) {
      throw new Error(`clause formula[${i}] must be an array.`)
    }

    for (let j = 0; j < clause.length; j++) {
      const literal = clause[j]
      if ('string' !== typeof literal) {
        throw new Error(`literal formula[${i}][${j}] must be a string.`)
      }

      const isNegated = literal[0] === '!'
      const variable = isNegated ? literal.slice(1) : literal
      if (variable.length === 0) {
        throw new Error(`literal formula[${i}][${j}] has an invalid format.`)
      }

      if (!(variable in variableToId)) variableToId[variable] = nextVariableId++
      const id = variableToId[variable]
      encodedFormula.push(isNegated ? id * -1 : id)
    }

    encodedFormula.push(0) // separator
  }

  const encodedAssumptions = []
  for (let i = 0; i < assumptions.length; i++) {
    const literal = assumptions[i]

    const isNegated = literal[0] === '!'
    const variable = isNegated ? literal.slice(1) : literal
    if (!(variable in variableToId)) {
      throw new Error(`unknown variable '${variable}' in assumptions[${i}].`)
    }

    const id = variableToId[variable]
    encodedAssumptions.push(isNegated ? id * -1 : id)
  }

  return [
    Buffer.from(encodedFormula),
    Buffer.from(encodedAssumptions)
  ]
}

const encodeIntegers = (formula, assumptions) => {
  if (!Array.isArray(formula)) throw new Error('formula must be an array.')
  if (!Array.isArray(assumptions)) throw new Error('assumptions must be an array.')
  if (formula.length === 0) {
    throw new Error('formula must have 1 or more clauses.')
  }

  const encodedFormula = []
  for (let i = 0; i < formula.length; i++) {
    const clause = formula[i]
    if (!Array.isArray(clause)) {
      throw new Error(`clause formula[${i}] must be an array.`)
    }

    for (let j = 0; j < clause.length; j++) {
      const literal = clause[j]
      if ('number' !== typeof literal) {
        throw new Error(`literal formula[${i}][${j}] must be a number.`)
      }
      if ((literal | 0) !== literal) {
        throw new Error(`literal formula[${i}][${j}] must be an integer.`)
      }
      if (literal === 0) {
        throw new Error(`literal formula[${i}][${j}] must be != 0.`)
      }

      encodedFormula.push(literal)
    }
    encodedFormula.push(0) // separator
  }

  for (let i = 0; i < assumptions.length; i++) {
    const literal = assumptions[i]
      if ('number' !== typeof literal) {
        throw new Error(`literal assumptions[${i}] must be a number.`)
      }
      if ((literal | 0) !== literal) {
        throw new Error(`literal assumptions[${i}] must be an integer.`)
      }
      if (literal === 0) {
        throw new Error(`literal assumptions[${i}] must be != 0.`)
      }
  }

  return [
    Buffer.from(encodedFormula),
    Buffer.from(assumptions)
  ]
}

const UNKNOWN = 'unknown'
const SATISFIABLE = 'satisfiable'
const UNSATISFIABLE = 'unsatisfiable'

const solveUnsafe = (formula, assumptions) => {
  return bindings.node_picosat_sat(formula, assumptions)
}

const _solve = (formula, assumptions, encode) => {
  const [encodedFormula, encodedAssumptions] = encode(formula, assumptions)
  const solution = solveUnsafe(encodedFormula, encodedAssumptions)

  let statusCode
  if (solution[0] === 10) statusCode = SATISFIABLE
  else if (solution[0] === 20) statusCode = UNSATISFIABLE
  else statusCode = UNKNOWN

  return {
    satisfiable: statusCode === 'satisfiable',
    status: statusCode,
    solution: solution.slice(1)
  }
}

const solveWithStrings = (formula, assumptions = []) => {
  return _solve(formula, assumptions, encodeStrings)
}

const solveWithIntegers = (formula, assumptions = []) => {
  return _solve(formula, assumptions, encodeIntegers)
}

Object.assign(solveWithIntegers, {
  encodeStrings, encodeIntegers,
  solveWithStrings, solveUnsafe,
  UNKNOWN, SATISFIABLE, UNSATISFIABLE
})
module.exports = solveWithIntegers
