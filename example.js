'use strict'

const solve = require('.')

// (A ⇒ B)∧(B ⇒ C)∧(C ⇒ A)
// (¬A ∨ B)∧(¬B ∨ C)∧(¬C ∨ A)
const formula = [
	['!A', 'B'],
	['!B', 'C'],
	['!C', 'A']
]

console.log(solve(formula, ['!A']))
