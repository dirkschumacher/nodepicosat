'use strict'

const {Suite} = require('benchmark')
const picosat_sat = require('.')

const simpleProblem = [[1, 2], [-1, 2]]

new Suite()

.add('very simple problem', function () {
	const res = picosat_sat(simpleProblem)
})

.on('error', (err) => {
	console.error(err)
	process.exitCode = 1
})
.on('cycle', (e) => {
	console.log(e.target.toString())
})
.run()
