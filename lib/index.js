const END = '--';
const FLAG = /^-{1,2}/;
const GROUP = /^-([a-z]{2,})/i;

function isNull(val) {
	return val === void 0 || val === null;
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
	return GROUP.test(str) && str.substr(1).split('');
}

function parse(key, val, strings) {
	val = isNull(val) || val === 'true' || (val === 'false' ? false : val);
	Array.isArray(strings) && ~strings.indexOf(key) && !isString(val) && (val = void 0);
	return val;
}

function compute(obj, key, val) {
	const grouped = isGroup(key);
	if (grouped) {
		grouped.forEach(k => obj[k] = true);
		return obj;
	}
	key = key.replace(FLAG, '');
	obj[key] = (key in obj) ? toArr(obj[key]).concat(val) : val;
	return obj;
}

module.exports = function (args, opts) {
	opts = opts || {};

	isString(opts.string) && (opts.string = [opts.string]);

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

		let toAdd;
		let incr = 1;
		const segs = val.split('=');

		if (segs.length > 1) {
			toAdd = segs[1];
		} else {
			let nxt = args[idx+1];
			isFlag(nxt) ? (nxt = true) : (incr = 2);
			toAdd = parse(segs[0], nxt, opts.string);
		}

		compute(out, segs[0], toAdd);

		idx += incr;
	}

	out._ = arr;

	return out;
}
