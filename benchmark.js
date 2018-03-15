'use strict'

const {Suite} = require('benchmark')

const solve = require('.')
const {encodeStrings, solveWithIntegers, solveUnsafe} = solve

// (¬A ∨ B)∧(¬B ∨ C)∧(¬C ∨ A)
const formula1 = [['!A', 'B'], ['!B', 'C'], ['!C', 'A']]
const assumptions1 = []
const intFormula1 = [[-1, 2], [-2, 3], [-3, 1]]
const intAssumptions1 = []
const [encFormula1, encAssumptions1] = encodeStrings(formula1, assumptions1)

const formula2 = [
	['!A', 'B', 'C'],
	['!B', 'C'],
	['!C', 'D'],
	['!D', 'A', 'B', 'C']
]
const assumptions2 = ['A', '!C']
const intFormula2 = [
	[-1, 2, 3],
	[-2, 3],
	[-3, 4],
	[-4, 1, 2, 3]
]
const intAssumptions2 = [1, -3]
const [encFormula2, encAssumptions2] = encodeStrings(formula2, assumptions2)

new Suite()

.add('example 1 – solve', function () {
	solve(formula1, assumptions1)
})
.add('example 1 – solveWithIntegers', function () {
	solveWithIntegers(intFormula1, intAssumptions1)
})
.add('example 1 – solveUnsafe', function () {
	solveUnsafe(encFormula1, encAssumptions1)
})

.add('example 2 – solve', function () {
	solve(formula2, assumptions2)
})
.add('example 2 – solveWithIntegers', function () {
	solveWithIntegers(intFormula2, intAssumptions2)
})
.add('example 2 – solveUnsafe', function () {
	solveUnsafe(encFormula2, encAssumptions2)
})

.on('error', (err) => {
	console.error(err)
	process.exitCode = 1
})
.on('cycle', (e) => {
	console.log(e.target.toString())
})
.run()
