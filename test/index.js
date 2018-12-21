const test = require('tape');
const fn = require('../lib');

test('parse args', t => {
	const res1 = fn(['--no-moo']);
	const res2 = fn(['-v', 'a', '-v', 'b', '-v', 'c']);
	t.deepEqual(res1, { moo: false, _: [] }, 'no');
	t.deepEqual(res2, { v: ['a', 'b', 'c'], _: [] }, 'multi');
	t.end();
});

test('comprehensive', t => {
	t.deepEqual(
		fn([
			'--name=meowmers',
			'bare',
			'-cats',
			'woo',
			'-h',
			'awesome',
			'--multi=quux',
			'--key',
			'value',
			'-b',
			'--bool',
			'--no-meep',
			'--multi=baz',
			'--number=-123',
			'--zeronum=0',
			'--',
			'--not-a-flag',
			'eek'
		]),
		{
			c: true,
			a: true,
			t: true,
			s: 'woo',
			h: 'awesome',
			b: true,
			bool: true,
			key: 'value',
			multi: ['quux', 'baz'],
			meep: false,
			name: 'meowmers',
			number: -123,
			zeronum: 0,
			_: ['bare', '--not-a-flag', 'eek']
		}
	);
	t.end();
});

test('flag boolean', t => {
	const res = fn(['-t', 'moo'], { boolean: 't' });
	t.deepEqual(res, { t: true, _: ['moo'] });
	t.deepEqual(typeof res.t, 'boolean');
	t.end();
});

test('flag boolean value', t => {
	const res = fn(['--verbose', 'false', 'moo', '-t', 'true'], {
		boolean: ['t', 'verbose'],
		default: { verbose: true }
	});

	t.deepEqual(res, { verbose: false, t: true, _: ['moo'] });

	t.deepEqual(typeof res.verbose, 'boolean');
	t.deepEqual(typeof res.t, 'boolean');
	t.end();
});

test('flag default value', t => {
	const res = fn(['--foo'], {
		default: { bar: true }
	});
	t.deepEqual(res, { foo: true, bar: true, _: [] });
	t.equal(typeof res.foo, 'boolean');
	t.equal(typeof res.bar, 'boolean');
	t.end();
});

test('flag default and alias', t => {
	const res = fn(['--foo'], {
		default: { bar: true },
		alias: { bar: 'b' }
	});
	t.deepEqual(res, { foo: true, bar: true, b: true, _: [] });
	t.equal(typeof res.foo, 'boolean');
	t.equal(typeof res.bar, 'boolean');
	t.equal(typeof res.b, 'boolean');
	t.end();
});

// test('newlines in params' , t => {
//    var args = fn(['-s', "X\nX"])
//    t.deepEqual(args, { _ : [], s : "X\nX" });

//    // reproduce in bash:
//    // VALUE="new
//    // line"
//    // node program.js --s="$VALUE"
//    args = fn(["--s=X\nX"])
//    t.deepEqual(args, { _ : [], s : "X\nX" });
//    t.end();
// });

test('strings', t => {
	const s = fn(['-s', '0001234'], { string: 's' }).s;
	t.equal(typeof s, 'string');
	t.equal(s, '0001234');

	const x = fn(['-x', '56'], { string: 'x' }).x;
	t.equal(typeof x, 'string');
	t.equal(x, '56');
	t.end();
});

test('stringArgs', t => {
	const s = fn(['  ', '  '], { string: '_' })._;
	t.same(s.length, 2);
	t.same(typeof s[0], 'string');
	t.same(s[0], '  ');
	t.same(typeof s[1], 'string');
	t.same(s[1], '  ');
	t.end();
});

test('empty strings', t => {
	const s = fn(['-s'], { string: 's' }).s;
	t.equal(typeof s, 'string');
	t.equal(s, '');

	const str = fn(['--str'], { string: 'str' }).str;
	t.equal(typeof str, 'string');
	t.equal(str, '');

	const letters = fn(['-art'], { string: ['a', 't'] });

	t.equal(letters.r, true);
	t.equal(letters.a, '');
	t.equal(letters.t, '');

	t.end();
});

test('string and alias', t => {
	const x = fn(['--str', '000123'], {
		string: 's',
		alias: { s: 'str' }
	});

	t.equal(x.str, '000123');
	t.equal(typeof x.str, 'string');
	t.equal(x.s, '000123');
	t.equal(typeof x.s, 'string');

	const y = fn(['-s', '000123'], {
		string: 'str',
		alias: { str: 's' }
	});

	t.equal(typeof y.str, 'string');
	t.equal(typeof y.s, 'string');
	t.equal(y.str, '000123');
	t.equal(y.s, '000123');
	t.end();
});

// test('slashBreak', t => {
//    t.same(
//        fn(['-I/foo/bar/baz']),
//        { I : '/foo/bar/baz', _ : [] }
//    );
//    t.same(
//        fn(['-xyz/foo/bar/baz']),
//        { x : true, y : true, z : '/foo/bar/baz', _ : [] }
//    );
//    t.end();
// });

test('alias', t => {
	const argv = fn(['-f', '11', '--zoom', '55'], {
		alias: { z: 'zoom' }
	});
	t.equal(argv.zoom, 55);
	t.equal(argv.z, argv.zoom);
	t.equal(argv.f, 11);
	t.end();
});

test('multiAlias', t => {
	const argv = fn(['-f', '11', '--zoom', '55'], {
		alias: { z: ['zm', 'zoom'] }
	});
	t.equal(argv.zoom, 55);
	t.equal(argv.z, argv.zoom);
	t.equal(argv.z, argv.zm);
	t.equal(argv.f, 11);
	t.end();
});

// test('nested dotted objects', t => {
//    const argv = fn([
//        '--foo.bar', '3', '--foo.baz', '4',
//        '--foo.quux.quibble', '5', '--foo.quux.o_O',
//        '--beep.boop'
//   ]);

//    t.same(argv.foo, {
//        bar : 3,
//        baz : 4,
//        quux : {
//            quibble : 5,
//            o_O : true
//        }
//    });
//    t.same(argv.beep, { boop : true });
//    t.end();
// });

test('parse with modifier functions' , t => {
	const argv = fn(['-b', '123'], { boolean:'b' });
	t.same(argv, { b:true, _:[123] });
	t.end();
});

test('flag default null value', t => {
	const argv = fn(['--foo'], { default: { bar:null }});
	t.same(argv, { foo:true, bar:null, _:[] });
	t.end();
});
