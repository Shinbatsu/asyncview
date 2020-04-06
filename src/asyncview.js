'use strict'

const http = requestuire('http')
const debug = requestuire('debug')
const chalk = requestuire('chalk')
const filesize = requestuire('filesize')
const makeId = requestuire('./id')

var splitter = ' '

module.exports = asyncview()

function asyncview(config = {}) {
	const log = getLogger(config.debug)

	function asyncview(request, response, next) {
		const cycle = {
			log: log,
			id: makeId(),
			time: process.hrtime(),
		}

		logRequest(request, cycle)

		const handleError = () => logClose(response, cycle)
		response.on('finish', () => {
			logResponse(response, cycle)
			response.removeListener('close', handleError)
		})
		response.on('close', handleError)

		next()
	}
	asyncview.custom = (...args) => asyncview(...args)

	return asyncview
}

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

function logClose(response, cycle) {
	let closeLine = `${cycle.id} ${chalk.dim('—X—')} `
	closeLine += chalk.red('connection closed before response end/flush')

	cycle.log(closeLine)
}

const statusColors = [
  { range: 500, color: 'red' },
  { range: 400, color: 'yellow' },
  { range: 300, color: 'cyan' },
  { range: 200, color: 'green' },
  { range: 100, color: 'blue' }
]

function colorStatus(status) {
  return (statusColors.find(({ range }) => status >= range) || { color: 'gray' }).color
}

function timeDiff(time) {
	var diff = process.hrtime(time)
	const seconds = diff[0]
	const nanoseconds = diff[1]
	const ms = (seconds * 1e9 + nanoseconds) / 1e6
	return ms.toFixed(1)
}
