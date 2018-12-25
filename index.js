const fs = require('fs');
const process = require('process');
const { promisify } = require('util');
const { blue, magenta, red } = require('chalk');
const minimist = require('minimist');

const readFile = promisify(fs.readFile);

//
//	usage:
//	yarn aoc18 --day <dayNumber> --part <partNumber> --help
//
//	--day	The day to run.
//	--part	The part to run.
//	--help	Show usage information.
//

function showHelp() {
	console.info(
		`usage: yarn solve ${magenta([`--day`])} ${blue(
			`<dayNumber>`
		)} ${magenta([`--part`])} ${blue(`<partNumber>`)} ${magenta([
			`--debug`
		])} ${magenta([`--help`])}`
	);
	console.info(`${magenta(`--day`)}\tThe day to run.`);
	console.info(`${magenta(`--part`)}\tThe part to run.`);
	console.info(`${magenta(`--debug`)}\tUse input-debug instead of input.`);
	console.info(`${magenta(`--help`)}\tShow usage information.`);
}

async function processSolution(day, part, debug = false) {
	const path = `./solutions/day${day}`;

	const inFile = debug ? 'input-debug' : 'input';

	try {
		const input = await readFile(`${path}/${inFile}`, 'utf-8');
		const answer = require(`${path}/part${part}`)(input);

		console.info(`part ${part} > ${answer}`);
	} catch (e) {
		console.error(red(e.message));
	}
}

const { day, part, debug, help } = minimist(process.argv.slice(2));

if (!day || !part || help) {
	showHelp();
	process.exit(0);
}

// Try and read the input from the directory. Always read as a string
processSolution(day, part, debug).then(() => process.exit(0));
