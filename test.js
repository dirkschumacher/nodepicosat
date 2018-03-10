"use strict"

const test = require("tape")
const solve = require(".")
const {encode, solveUnsafe, SATISFIABLE, UNSATISFIABLE} = solve

const formula1 = [
  ['A', 'B'],
  ['!A', 'B']
]
const assumptions1 = ['!A', 'B']

test('solve solves a simple problem', (t) => {
  const {status, satisfiable} = solve(formula1)

  t.equal(status, SATISFIABLE)
  t.equal(satisfiable, true)
  t.end()
})

test('solve supports assumptions', (t) => {
  const {solution, status, satisfiable} = solve(formula1, assumptions1)

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
