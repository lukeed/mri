const test = require('tape');
const fn = require('../lib');

test('nums', t => {
	const argv = fn([
		'-x', '1234',
		'-y', '5.67',
		'-z', '1e7',
		'-w', '10f',
		'--hex', '0xdeadbeef',
		'789'
	]);
	t.same(argv, {
		x : 1234,
		y : 5.67,
		z : 1e7,
		w : '10f',
		hex : 0xdeadbeef,
		_ : ['789']
	});
	t.is(typeof argv.x, 'number');
	t.is(typeof argv.y, 'number');
	t.is(typeof argv.z, 'number');
	t.is(typeof argv.w, 'string');
	t.is(typeof argv.hex, 'number');
	t.is(typeof argv._[0], 'string');
	t.end();
});

test('already a number', t => {
	const argv = fn(['-x', 1234, 789]);
	t.same(argv, { x:1234, _:[789] });
	t.is(typeof argv._[0], 'number');
	t.is(typeof argv.x, 'number');
	t.end();
});

test('large integers use BigInt to preserve precision', t => {
	const argv = fn(['--id', '9007199254740993', '--small', '42']);
	t.is(argv.id, 9007199254740993n);
	t.is(typeof argv.id, 'bigint');
	t.is(argv.small, 42);
	t.is(typeof argv.small, 'number');
	t.end();
});

test('MAX_SAFE_INTEGER boundary', t => {
	// MAX_SAFE_INTEGER = 9007199254740991
	const argv = fn([
		'--safe', '9007199254740991',
		'--unsafe', '9007199254740993'
	]);
	t.is(argv.safe, 9007199254740991);
	t.is(typeof argv.safe, 'number');
	t.is(argv.unsafe, 9007199254740993n);
	t.is(typeof argv.unsafe, 'bigint');
	t.end();
});

test('large negative integers', t => {
	const argv = fn(['--id=-9007199254740993']);
	t.is(argv.id, -9007199254740993n);
	t.is(typeof argv.id, 'bigint');
	t.end();
});
