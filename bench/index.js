const Table = require('cli-table2');
const { Suite } = require('benchmark');
const yargs = require('yargs-parser');
const minimist = require('minimist');
const mri = require('../lib');

const bench = new Suite();
const args = ['-b', '--bool', '--no-meep', '--multi=baz'];

bench
	.add('mri', () => mri(args))
	.add('yargs', () => yargs(args))
	.add('minimist', () => minimist(args))
	.on('cycle', e => console.log(String(e.target)))
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));

		const tbl = new Table({
			head: ['Name', 'Mean time', 'Ops/sec', 'Diff']
		});

		let prev, diff;

		bench.forEach(el => {
			if (prev) {
				diff = ((el.hz - prev) * 100 / prev).toFixed(2) + '% faster';
			} else {
				diff = 'N/A'
			}
			prev = el.hz;
			tbl.push([el.name, el.stats.mean, el.hz.toLocaleString(), diff])
		});
		console.log(tbl.toString());
	})
	.run();
