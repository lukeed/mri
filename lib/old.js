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

function isNumber(val) {
	// if (typeof val === 'number') return true;
	// if (/^0x[0-9a-f]+$/i.test(val)) return true;
	// return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(val);
	return !isNaN(val);
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

function getAlias(key, obj) {
	for (const k in obj) {
		if (~obj[k].indexOf(key)) return obj[k].concat(k);
	}
	return [];
}

function getValue(keys, obj) {
	let i = 0, len = keys.length;
	for (; i < len; i++) {
		if (obj[keys[i]] !== void 0) return obj[keys[i]];
	}
}

function truthy(val) {
	return isNull(val) || val === 'true' || (val === 'false' ? false : val);
}

function typecast(key, val, types) {
	if (~types.string.indexOf(key)) return isString(val) ? val : '';
	if (~types.boolean.indexOf(key)) return isBool(val) ? val : Boolean(val);
	return isNumber(val) && !isBool(val) ? +val : val;
	// return isNumber(val) ? +val : val;
}

function setTypes(obj, types) {
	const tar = Object.assign(types.default, obj);
	for (const k in obj) {
		const alias = getAlias(k, types.alias);
		const keys = [k].concat(alias);
		// const val = isNull(tar[k]) ? getValue(keys, obj, types) : tar[k];
		const val = getValue(keys, obj, types);
		const v = typecast(k, val, types);
		keys.forEach(str => {
			tar[str] = v;
		});
	}
	return tar;
}

module.exports = function(args, opts) {
	opts = Object.assign({ default: {}, alias: {} }, opts);

	let aliases = {};
	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

	for (const k in opts.alias) {
		const nxt = opts.alias[k];
		const val = toArr(aliases[k]);
		if (~val.indexOf(nxt)) continue; // skip non-uniques
		aliases[k] = val.concat(nxt);
		// add aliases to string|boolean type-lists
		~opts.boolean.indexOf(k) && opts.boolean.push(nxt);
		~opts.string.indexOf(k) && opts.string.push(nxt);
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

			let nxt = args[idx + 1];
			isFlag(nxt) ? (nxt = true) : (incr = 2);
			const toAdd = segs.length > 1 ? segs[1] : truthy(nxt);
			out[flag] = flag in out ? toArr(out[flag]).concat(toAdd) : toAdd;
		}

		idx += incr;
	}

	return Object.assign(setTypes(out, opts), { _: arr });
};
