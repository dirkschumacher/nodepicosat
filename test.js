"use strict"

const test = require("tape")
const picosat_sat = require(".")

test("it solves a simple problem", (t) => {
  const formula = [1, 2, 0, -1, 2, 0]
  const assumptions = []
  const result = picosat_sat(formula, assumptions)
  t.equal(result.satisfiable, true)
  t.end()
})

test("it supports assumptions", (t) => {
  const formula = [1, 2, 0, -1, 2, 0]
  const assumptions = [1, 2]
  const result = picosat_sat(formula, assumptions)
  t.equal(result.satisfiable, true)
  t.equal(result.solution.length, 2)
  t.equal(result.solution[0], 1)
  t.equal(result.solution[1], 2)
  t.end()
})

test("it correctly proves unsatisfiability", (t) => {
  const formula = [1, 0, -1, 0]
  const assumptions = []
  const result = picosat_sat(formula, assumptions)
  t.equal(result.satisfiable, false)
  t.end()
})
