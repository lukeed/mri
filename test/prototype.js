const test = require('tape');
const fn = require('../lib');

test('prototype-named flags retain only parsed values', t => {
	const argv = fn(['--toString=first', '--toString=second', '--constructor=value']);
	t.deepEqual(argv.toString, ['first', 'second']);
	t.equal(argv.constructor, 'value');
	t.equal(Object.getPrototypeOf(argv), Object.prototype);
	t.end();
});

test('prototype-named flags with aliases and defaults', t => {
	const argv = fn(['--constructor=provided'], {
		alias: {},
		default: { constructor: 'fallback', toString: 'default' }
	});
	t.equal(argv.constructor, 'provided');
	t.equal(argv.toString, 'default');
	t.end();
});

test('__proto__ is a data flag', t => {
	const argv = fn(['--__proto__=first', '--__proto__=second']);
	t.deepEqual(argv.__proto__, ['first', 'second']);
	t.equal(Object.getPrototypeOf(argv), Object.prototype);
	t.ok(Object.prototype.hasOwnProperty.call(argv, '__proto__'));

	const negated = fn(['--no-__proto__']);
	t.equal(negated.__proto__, false);
	t.equal(Object.getPrototypeOf(negated), Object.prototype);
	t.end();
});

test('__proto__ defaults and aliases are own data', t => {
	const defaults = JSON.parse('{"__proto__":"fallback"}');
	const argv = fn([], { default: defaults });
	t.equal(argv.__proto__, 'fallback');
	t.equal(Object.getPrototypeOf(argv), Object.prototype);

	const alias = { p: '__proto__' };
	const aliased = fn(['-p', 'value'], { alias: alias });
	t.equal(aliased.p, 'value');
	t.equal(aliased.__proto__, 'value');
	t.equal(Object.getPrototypeOf(aliased), Object.prototype);
	t.equal(Object.getPrototypeOf(alias), Object.prototype);
	t.end();
});
