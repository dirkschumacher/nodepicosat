'use strict'

const test = require('tape')
const solve = require('.')
const {
  encodeStrings, encodeIntegers,
  solveWithIntegers, solveUnsafe,
  SATISFIABLE, UNSATISFIABLE
} = solve

const formula1 = [
  ['!A', 'B', 'C'],
  ['!B', 'C'],
  ['!C', 'D'],
  ['!D', 'A', 'B', 'C']
]
const assumptions1 = ['A', '!C']

const formula2 = [
  ['A', 'B'],
  ['!A', 'B']
]
const assumptions2 = ['!A', 'B']

test('encodeStrings works', (t) => {
  const [encFormula, encAssumptions] = encodeStrings(formula1, assumptions1)

  const expectedFormula = Buffer.from([
    256 - 1, 2, 3, 0,
    256 - 2, 3, 0,
    256 - 3, 4, 0,
    256 - 4, 1, 2, 3, 0
  ])
  t.ok(Buffer.isBuffer(encFormula))
  t.equal(encFormula.toString('hex'), expectedFormula.toString('hex'))

  const expectedAssumptions = Buffer.from([1, 256 - 3])
  t.ok(Buffer.isBuffer(encAssumptions))
  t.equal(encAssumptions.toString('hex'), expectedAssumptions.toString('hex'))

  t.end()
})

test('encodeIntegers works', (t) => {
  const [encFormula, encAssumptions] = encodeIntegers([
    [ 1, 2], // A, B
    [-1, 2] // !A, B
  ], [
    -1 // !A
  ])

  const expectedFormula = Buffer.from([
    1, 2, 0,
    256 - 1, 2, 0
  ])
  t.ok(Buffer.isBuffer(encFormula))
  t.equal(encFormula.toString('hex'), expectedFormula.toString('hex'))

  const expectedAssumptions = Buffer.from([256 - 1])
  t.ok(Buffer.isBuffer(encAssumptions))
  t.equal(encAssumptions.toString('hex'), expectedAssumptions.toString('hex'))

  t.end()
})

test('solveWithIntegers works', (t) => {
  // (¬A ∨ B)∧(¬B ∨ C)∧(¬C ∨ A)
  // A = 1, B = 2, C = 3
  const {status, satisfiable} = solveWithIntegers([
    [-1, 2],
    [-2, 3],
    [-3, 1]
  ], [
    1
  ])

  t.equal(status, SATISFIABLE)
  t.equal(satisfiable, true)
  t.end()
})

test('solveUnsafe works', (t) => {
  // (¬A ∨ B)∧(¬B ∨ C)∧(¬C ∨ A)
  // A = 1, B = 2, C = 3
  const encFormula = Buffer.from([
    256 - 1, 2, 0,
    256 - 2, 3, 0,
    256 - 3, 1, 0
  ])
  const encAssumptions = Buffer.from([])

  const solution = solveUnsafe(encFormula, encAssumptions)
  t.equal(solution[0], 10) // assert if satisfiable
  t.end()
})

test('solve solves a simple problem', (t) => {
  const {status, satisfiable} = solve(formula2)

  t.equal(status, SATISFIABLE)
  t.equal(satisfiable, true)
  t.end()
})

test('solve supports assumptions', (t) => {
  const {solution, status, satisfiable} = solve(formula2, assumptions2)

  t.equal(solution.length, 2)
  t.equal(solution[0], -1)
  t.equal(solution[1], 2)
  t.equal(status, SATISFIABLE)
  t.equal(satisfiable, true)
  t.end()
})

test('solve correctly proves unsatisfiability', (t) => {
  const formula = [['A'], ['!A']]
  const assumptions = []
  const {status, satisfiable} = solve(formula, assumptions)

  t.equal(status, UNSATISFIABLE)
  t.equal(satisfiable, false)
  t.end()
})
