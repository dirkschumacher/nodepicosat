'use strict'

const {Suite} = require('benchmark')

const solve = require('.')
const {encode, solveUnsafe} = solve

// (¬A ∨ B)∧(¬B ∨ C)∧(¬C ∨ A)
const formula1 = [['!A', 'B'], ['!B', 'C'], ['!C', 'A']]
const assumptions1 = []
const [encFormula1, encAssumptions1] = encode(formula1, assumptions1)

const formula2 = [
	['!A', 'B', 'C'],
	['!B', 'C'],
	['!C', 'D'],
	['!D', 'A', 'B', 'C']
]
const assumptions2 = ['A', '!C']
const [encFormula2, encAssumptions2] = encode(formula2, assumptions2)

new Suite()

.add('example 1 – solve', function () {
	solve(formula1, assumptions1)
})
.add('example 1 – solveUnsafe', function () {
	solveUnsafe(encFormula1, encAssumptions1)
})

.add('example 2 – solve', function () {
	solve(formula2, assumptions2)
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
