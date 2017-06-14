const test = require('tape');
const fn = require('../lib');

test('boolean and alias is not unknown', t => {
	const unknown = [];
	const unknownFn = arg => (unknown.push(arg), false);
	const aliased = ['-h', 'true', '--derp', 'true'];
	const regular = ['--herp', 'true', '-d', 'true'];
	const opts = {
		alias: { h: 'herp' },
		boolean: 'h',
		unknown: unknownFn
	};
	const aliasedArgv = fn(aliased, opts);
	const propertyArgv = fn(regular, opts);

	t.same(unknown, ['--derp', '-d']);
	t.end();
});

// test('flag boolean true any double hyphen argument is not unknown', t => {
// 	const unknown = [];
// 	const unknownFn = arg => (unknown.push(arg),false);

// 	const argv = fn(['--honk', '--tacos=good', 'cow', '-p', '55'], { boolean: true, unknown: unknownFn });
// 	t.same(unknown, ['--tacos', 'cow', '-p']);
// 	t.same(argv, { honk: true, _: [] });
// 	t.end();
// });

test('string and alias is not unknown', t => {
	const unknown = [];
	const unknownFn = arg => (unknown.push(arg), false);
	// const unknownFn = arg => console.log('unknown arg', arg);

	const aliased = ['-h', 'hello', '--derp', 'goodbye'];
	const regular = ['--herp', 'hello', '-d', 'moon'];
	const opts = {
		alias: { h: 'herp' },
		string: 'h',
		unknown: unknownFn
	};
	const aliasedArgv = fn(aliased, opts);
	const propertyArgv = fn(regular, opts);

	t.same(unknown, ['--derp', '-d']);
	t.end();
});

test('default and alias is not unknown', t => {
	const unknown = [];
	const unknownFn = arg => (unknown.push(arg), false);

	const aliased = ['-h', 'hello'];
	const regular = ['--herp', 'hello'];
	const opts = {
		default: { h: 'bar' },
		alias: { h: 'herp' },
		unknown: unknownFn
	};
	const aliasedArgv = fn(aliased, opts);
	const propertyArgv = fn(regular, opts);

	t.same(unknown, []);
	t.end();
	unknownFn(); // exercise fn for 100% coverage
});

// test('value following -- is not unknown', t => {
// 	const unknown = [];
// 	const unknownFn = arg => (unknown.push(arg),false);

// 	const aliased = [ '--bad', '--', 'good', 'arg' ];
// 	const opts = { '--': true, unknown: unknownFn };
// 	const argv = fn(aliased, opts);

// 	t.same(unknown, ['--bad']);
// 	t.same(argv, { '--': ['good', 'arg'], '_': [] });
// 	t.end();
// });
