'use strict'

const test = require('tape')
const solve = require('.')
const encodeInt32Array = require('./lib/encode')
const {
  encodeStrings, encodeIntegers,
  solveWithStrings, solveUnsafe,
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

test('encodeInt32Array works', (t) => {
  const buf = encodeInt32Array([
    1,
    -1,
    1000,
    -1000
  ])

  t.ok(Buffer.isBuffer(buf))
  const expectedBuf = Buffer.from([
    0x01, 0x00, 0x00, 0x00,
    0xff, 0xff, 0xff, 0xff,
    0xe8, 0x03, 0x00, 0x00,
    0x18, 0xfc, 0xff, 0xff
  ])
  t.equal(buf.toString('hex'), expectedBuf.toString('hex'))
  t.end()
})

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

test('solve works', (t) => {
  // (¬A ∨ B)∧(¬B ∨ C)∧(¬C ∨ A)
  // A = 1, B = 2, C = 3
  const {status, satisfiable} = solve([
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

test('solve works with >255 variables', (t) => {
  // We check if it supports more than 255 variables in order to assert
  // that it does not write Int8 values.
  const largeFomula = []
  const expectedSolution = []
  for (let i = 1, j = 0; i < 1000; i++) {
    const v = i * (i % 2 === 0 ? -1 : 1) // 1, -2, 3, -4, …
    largeFomula.push([v])
    expectedSolution.push(v)
  }

  const {satisfiable, solution} = solve(largeFomula)
  t.equal(satisfiable, true)
  t.deepEqual(solution, expectedSolution)
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

test('solveWithStrings solves a simple problem', (t) => {
  const {status, satisfiable} = solveWithStrings(formula2)

  t.equal(status, SATISFIABLE)
  t.equal(satisfiable, true)
  t.end()
})

test('solveWithStrings supports assumptions', (t) => {
  const {solution, status, satisfiable} = solveWithStrings(formula2, assumptions2)

  t.equal(solution.length, 2)
  t.equal(solution[0], -1)
  t.equal(solution[1], 2)
  t.equal(status, SATISFIABLE)
  t.equal(satisfiable, true)
  t.end()
})

test('solveWithStrings correctly proves unsatisfiability', (t) => {
  const formula = [['A'], ['!A']]
  const assumptions = []
  const {status, satisfiable} = solveWithStrings(formula, assumptions)

  t.equal(status, UNSATISFIABLE)
  t.equal(satisfiable, false)
  t.end()
})
