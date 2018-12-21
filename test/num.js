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
