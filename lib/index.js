const END = '--';
const FLAG = /^-{1,2}/;
const GROUP = /^-([a-z]{2,})/i;

function isNull(val) {
	return val === void 0 || val === null;
}

function isBool(val) {
	return typeof val === 'boolean';
}

function isString(val) {
	return typeof val === 'string';
}

function toArr(val) {
	return Array.isArray(val) ? val : isNull(val) ? [] : [val];
}

function isFlag(str) {
	return FLAG.test(str);
}

function isGroup(str) {
	return GROUP.test(str);
}

function hasAlias(key, obj) {
	for (const k in obj) {
		if (~obj[k].indexOf(key)) return k;
	}
}

function truthy(val) {
	return isNull(val) || val === 'true' || (val === 'false' ? false : val);
}

function attach(obj, key, val) {
	obj[key] = (key in obj) ? toArr(obj[key]).concat(val) : val;
	return obj;
}

function typecast(key, val, types) {
	if (isNull(val)) return val;
	if (~types.string.indexOf(key)) return isString(val) ? val : '';
	if (~types.boolean.indexOf(key)) return isBool(val) ? val : Boolean(val);
}

function setTypes(obj, types) {
	const tar = types.default;
	for (const k in obj) {
		const key = hasAlias(k, types.alias) || k;
		tar[k] = typecast(key, obj[k], types);
		(key !== k) && (tar[key] = tar[k]);
	}
	return tar;
}

module.exports = function (args, opts) {
	opts = Object.assign({ default:{}, alias:{} }, opts);

	let aliases = {};
	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

	for (const k in opts.alias) {
		const val = toArr(aliases[k]);
		if (~val.indexOf(opts.alias[k])) continue; // skip non-uniques
		aliases[k] = val.concat(opts.alias[k]);
		// (aliases[k] = val.concat(opts.alias[k])).forEach(v => {
			// aliases[v] = [k]; // point alias back to original
			// ~opts.string.indexOf(k) && opts.string.push(v); // add alias to stirng cast
		// });
	}

	opts.alias = aliases;

	let idx = 0;
	let arr = [];
	const out = {};

	while (!isNull(args[idx])) {
		const val = args[idx];

		if (!isFlag(val)) {
			arr.push(val);
			idx++;
			continue;
		}

		if (val === END) {
			arr = arr.concat(args.slice(args.indexOf(END) + 1));
			break;
		}

		const segs = val.split('=');
		let flag = segs[0];
		let incr = 1;

		if (isGroup(flag)) {
			flag.substr(1).split('').forEach(k => out[k] = true);
		} else {
			flag = flag.replace(FLAG, '');

			let nxt = args[idx+1];
			isFlag(nxt) ? (nxt = true) : (incr = 2);
			const toAdd = (segs.length > 1) ? segs[1] : truthy(nxt);
			attach(out, flag, toAdd);
		}

		idx += incr;
	}

	return Object.assign(setTypes(out, opts), { _:arr });
}
