const FLAG = /^-{1,2}/;
const PREFIX = /^--no-/i;
const GROUP = /^-([a-z]{2,})/i;

function toArr(any) {
	return Array.isArray(any) ? any : any == null ? [] : [any];
}

function toString(any) {
	return any == void 0 ? '' : String(any);
}

function toBool(any) {
	return any === 'false' ? false : Boolean(any);
}

function toNum(any) {
	return (typeof any !== 'boolean' && Number(any)) || any;
}

function getAlibi(names, arr) {
	if (arr.length === 0) return arr;
	let k, i = 0, len = arr.length, vals = [];
	for (; i < len; i++) {
		k = arr[i];
		vals.push(k);
		if (names[k] !== void 0) {
			vals = vals.concat(names[k]);
		}
	}
	return vals;
}

module.exports = function(args, opts) {
	args = args || [];
	opts = opts || {};

	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

	const aliases = {};
	let k, i, j, x, y, len, type;

	if (opts.alias !== void 0) {
		for (k in opts.alias) {
			aliases[k] = toArr(opts.alias[k]);
			len = aliases[k].length; // save length
			for (i = 0; i < len; i++) {
				x = aliases[k][i]; // aliases key name
				aliases[x] = [k]; // set initial array
				for (j = 0; j < len; j++) {
					if (x !== aliases[k][j]) {
						aliases[x].push(aliases[k][j]);
					}
				}
			}
		}
	}

	if (opts.default !== void 0) {
		for (k in opts.default) {
			type = typeof opts.default[k];
			opts[type] = (opts[type] || []).concat(k);
		}
	}

	// apply to all aliases
	opts.string = getAlibi(aliases, opts.string);
	opts.boolean = getAlibi(aliases, opts.boolean);

	let idx = 0;
	const out = { _: [] };

	while (args[idx] !== void 0) {
		const val = args[idx];
		let incr = 1;

		if (val === '--') {
			out._ = out._.concat(args.slice(idx + 1));
			break;
		} else if (!FLAG.test(val)) {
			out._.push(val);
		} else if (PREFIX.test(val)) {
			out[val.replace(PREFIX, '')] = false;
		} else if (GROUP.test(val)) {
			val.substr(1).split('').forEach(k => out[k] = true);
		} else {
			let value;
			const segs = val.split('=');
			const key = segs[0].replace(FLAG, '');

			if (segs.length > 1) {
				value = segs[1];
			} else {
				value = args[idx + 1];
				FLAG.test(value) ? (value = true) : (incr = 2);
			}

			// type-casting
			if (opts.string.indexOf(key) !== -1) {
				value = toString(value);
			} else if (opts.boolean.indexOf(key) !== -1) {
				value = toBool(value);
			} else {
				value = toNum(value);
			}

			out[key] = out.hasOwnProperty(key) ? toArr(out[key]).concat(value) : value;
		}

		idx += incr;
	}

	for (k in out) {
		if (aliases[k] !== void 0) {
			y = out[k];
			for (i = 0; i < aliases[k].length; i++) {
				x = aliases[k][i];
				out[x] = y; // assign value
			}
		}
	}

	return out;
};
