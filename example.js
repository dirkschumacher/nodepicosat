'use strict'

const {solveWithStrings} = require('.')

// (A ⇒ B)∧(B ⇒ C)∧(C ⇒ A)
// (¬A ∨ B)∧(¬B ∨ C)∧(¬C ∨ A)
const formula = [
	['!A', 'B'],
	['!B', 'C'],
	['!C', 'A']
]

console.log(solveWithStrings(formula, ['!A']))
