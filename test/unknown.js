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

test('unaliased string declarations are known in strict mode', t => {
	const unknown = [];
	const argv = fn(['--bar', 'value'], {
		alias: { f: 'foo' },
		string: ['foo', 'bar'],
		unknown: arg => unknown.push(arg)
	});
	t.same(argv, { _: [], bar: 'value' });
	t.same(unknown, []);
	t.end();
});

test('string declarations are known without any aliases', t => {
	const argv = fn(['-b', '5', '--name=hello'], {
		string: ['b', 'name'],
		unknown: () => false
	});
	t.same(argv, { _: [], b: '5', name: 'hello' });
	t.end();
});

test('boolean declarations accept short, long and negated flags', t => {
	const argv = fn(['-v', '--enabled', '--no-cache'], {
		boolean: ['v', 'enabled', 'cache'],
		unknown: () => false
	});
	t.same(argv, { _: [], v: true, enabled: true, cache: false });
	t.end();
});

test('single string and boolean declarations are known', t => {
	t.same(fn(['--name=hello'], { string: 'name', unknown: () => false }), { _: [], name: 'hello' });
	t.same(fn(['--verbose'], { boolean: 'verbose', unknown: () => false }), { _: [], verbose: true });
	t.end();
});

test('strict mode still rejects undeclared flags after known flags', t => {
	const unknown = [];
	const argv = fn(['--name=hello', '--other', '--name=ignored'], {
		string: ['name'],
		unknown: arg => (unknown.push(arg), false)
	});
	t.same(argv, false);
	t.same(unknown, ['--other']);
	t.end();
});

test('strict mode still rejects undeclared negated flags', t => {
	const unknown = [];
	const argv = fn(['--no-other'], {
		boolean: ['cache'],
		unknown: arg => (unknown.push(arg), false)
	});
	t.same(argv, false);
	t.same(unknown, ['--no-other']);
	t.end();
});
