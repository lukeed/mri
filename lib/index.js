const FLAG = /^-{1,2}/;
const GROUP = /^-([a-z]{2,})/i;

function toArr(val) {
	return Array.isArray(val) ? val : val == null ? [] : [val];
}

module.exports = function(args) {
	args = args || [];
	// opts = opts || {};

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

			out[key] = out.hasOwnProperty(key) ? toArr(out[key]).concat(value) : value;
		}

		idx += incr;
	}

	return out;
};
