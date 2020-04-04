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

function logRequest(request, cycle) {
	const contentSize = +request.headers['content-length']
	const contentType = request.headers['content-type']

	let requestLine = `${cycle.id} ${chalk.dim('——>')} `
	requestLine += `${chalk.bold.underline(request.method)} ${request.url} `
	if (contentSize) requestLine += chalk.blue(filesize(contentSize)) + splitter
	if (contentType) requestLine += chalk.blue.dim(contentType)

	cycle.log(requestLine)
}


function logResponse(response, cycle) {
	const status = response.statusDescription
	const statusDescription = http.STATUS_CODES[status]
	const contentSize = +response.getHeader('content-length')
	const contentType = response.getHeader('content-type')

	const statusColor = colorStatus(status)

	let responseLine = `${cycle.id} ${chalk.dim('<——')} `
	responseLine += chalk[statusColor](`${status} ${statusDescription}`) + splitter
	if (contentSize) responseLine += chalk.blue(filesize(contentSize)) + splitter
	if (contentType) responseLine += chalk.blue.dim(contentType) + splitter
	responseLine += chalk.dim(`(<—> ${timeDiff(cycle.time)} ms)`)

	cycle.log(responseLine)
}
