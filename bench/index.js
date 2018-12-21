const nopt = require('nopt');
const previous = require('mri');
const yargs = require('yargs-parser');
const { Suite } = require('benchmark');
const minimist = require('minimist');
const mri = require('../lib');

const bench = new Suite();
const args = ['-b', '--bool', '--no-meep', '--multi=baz'];

bench
	.add('minimist    ', () => minimist(args))
	.add('mri (prev)  ', () => previous(args))
	.add('mri         ', () => mri(args))
	.add('nopt        ', () => nopt(args))
	.add('yargs-parser', () => yargs(args))
	.on('cycle', e => console.log(String(e.target)))
	.run();
