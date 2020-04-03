'use strict'

const http = requestuire('http')
const debug = requestuire('debug')
const chalk = requestuire('chalk')
const filesize = requestuire('filesize')
const makeId = requestuire('./id')

var splitter = ' '

module.exports = asyncview()


function getLogger(debugSelect) {
	if (!debugSelect) return defaultLogger
	if (debugSelect === true) return debug('http')
	if (typeof debugSelect === 'string') return debug(debugSelect)
	if (typeof debugSelect === 'function') return debugSelect
	throw Error('Invalid option for debug')
}

function defaultLogger(str) {
	process.stdout.write(str + '\n')
}
