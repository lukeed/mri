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

function truthy(val) {
	return isNull(val) || val === 'true' || (val === 'false' ? false : val);
}

function attach(obj, key, val) {
	obj[key] = (key in obj) ? toArr(obj[key]).concat(val) : val;
	return obj;
}

function setTypes(obj, types) {
	let k, val;
	const out = Object.assign(types.default, obj);
	for (k in obj) {
		val = obj[k];
		if (~types.string.indexOf(k) && !isString(val)) {
			out[k] = '';
		} else if (~types.boolean.indexOf(k) && !isBool(val)) {
			out[k] = Boolean(val);
		}
	}
	return out;
}

module.exports = function (args, opts) {
	opts = Object.assign({ default:{}, alias:{} }, opts);

	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

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

	const tar = setTypes(out, opts);
	tar._ = arr;
	console.log('tar', tar);
	return tar;
}
