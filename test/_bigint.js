// BigInt tests - only loaded when BigInt is available (Node 10.4+)
const test = require('tape');
const fn = require('../lib');

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

test('MIN_SAFE_INTEGER boundary', t => {
	// MIN_SAFE_INTEGER = -9007199254740991
	const argv = fn([
		'--safe=-9007199254740991',
		'--unsafe=-9007199254740993'
	]);
	t.is(argv.safe, -9007199254740991);
	t.is(typeof argv.safe, 'number');
	t.is(argv.unsafe, -9007199254740993n);
	t.is(typeof argv.unsafe, 'bigint');
	t.end();
});
