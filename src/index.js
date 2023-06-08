function toArray(any) {
	return any == null ? [] : Array.isArray(any) ? any : [any];
}

function getNumberOrString(str) {
	const n = +str
	return (+n) * 0 === 0 ? n : str
}
function setValue(out, key, value, options) {
	let prev = out[key]
	let next
	if (options.string.indexOf(key) !== -1) {
		next = value == null || value === true ? '' : String(value);
		if (value === null || value === undefined || value === true) {
			next = '';
		} else {
			next = String(value);
		}
	} else if (typeof value === 'boolean') {
		next = value;
	} else if (options.boolean.indexOf(key) !== -1) {
		if (value === 'false') {
			next = false
		} else if (value === 'true') {
			next = true
		} else {
			out._.push(getNumberOrString(value))
			next = !!value
		}
	} else {
		next = getNumberOrString(value)
	}

	if (prev === undefined || prev === null) {
		out[key] = next
	} else {
		out[key] = Array.isArray(prev) ? prev.concat(next) : [prev, next]
	}
}

export default function (args, options) {
	args = args || [];
	options = options || {};

	const out = { _: [] };
	const len = args.length;

	const hasAliases = options.alias !== void 0;
	const strict = options.unknown !== void 0;
	const hasDefaults = options.default !== void 0;

	options.alias = options.alias || {};
	options.string = toArray(options.string);
	options.boolean = toArray(options.boolean);

	if (hasAliases) {
		// convert alias
		// from { h: ['he', 'help'] }
		// to   { h: ['he', 'help'], he: ['h', 'help'], help: ['h', 'he'] }
		for (let k in options.alias) {
			const aliasValues = options.alias[k] = toArray(options.alias[k]);
			for (let i = 0; i < aliasValues.length; i++) {
				const k2 = aliasValues[i]
				options.alias[k2] = aliasValues.concat(k)
				options.alias[k2].splice(i, 1)
			}
		}
	}

	// convert { alias: {b: 'bar'}, boolean: 'b' }
	// to { alias: {b: ['bar']}, boolean: ['b', 'bar'] }
	for (let i = options.boolean.length - 1; i >= 0; i--) {
		const arg = options.boolean[i]
		const aliases = options.alias[arg] || [];
		options.boolean.push.apply(options.boolean, aliases);
	}


	// convert { alias: {b: 'bar'}, string: 'b' }
	// to { alias: {b: ['bar']}, string: ['b', 'bar'] }
	for (let i = options.string.length - 1; i >= 0; i--) {
		const arg = options.string[i]
		const aliases = options.alias[arg] || [];
		options.string.push.apply(options.string, aliases);
	}

	if (hasDefaults) {
		// convert { default: { foo:true }, alias: { f:'foo' } }
		// to  { default: { foo:true }, alias: { f: 'foo' }, boolean: ['foo', 'f'] }
		for (let k in options.default) {
			const type = typeof options.default[k];
			const aliases = options.alias[k] = options.alias[k] || [];
			if (options[type] !== undefined) {
				options[type].push(k);
				options[type].push.apply(options[type], aliases);
			}
		}
	}

	const keys = strict ? Object.keys(options.alias) : [];

	for (let i = 0; i < len; i++) {
		let arg = args[i];

		if (arg === '--') {
			out._ = out._.concat(args.slice(i + 1));
			break;
		}

		let j
		for (j = 0; j < arg.length; j++) {
			if (arg.charCodeAt(j) !== 45) break; // consume all the "-" characters
		}

		if (j === 0) {
			out._.push(arg);
		} else if (arg.substring(j, j + 3) === 'no-') {
			const name = arg.substring(j + 3);
			if (strict && keys.indexOf(name) === -1) {
				return options.unknown(arg);
			}
			out[name] = false;
		} else {
			let idx
			for (idx = j + 1; idx < arg.length; idx++) {
				if (arg.charCodeAt(idx) === 61) break; // find a "="
			}

			let name = arg.substring(j, idx);
			let value = arg.substring(idx + 1)
			if (value === '') {
				if (i === len - 1 || args[i + 1].toString().charCodeAt(0) === 45) {
					value = true
				} else {
					value = args[i + 1]
					i += 1
				}
			}
			const names = (j === 2 ? [name] : name);

			for (let idx = 0; idx < names.length; idx++) {
				const name = names[idx];
				if (strict && keys.indexOf(name) === -1) return options.unknown('-'.repeat(j) + name);
				setValue(out, name, idx < names.length - 1 ? true : value, options);
			}
		}
	}

	if (hasDefaults) {
		for (let k in options.default) {
			if (out[k] === undefined) {
				out[k] = options.default[k];
			}
		}
	}

	if (hasAliases) {
		for (let k in out) {
			const aliases = options.alias[k] || [];
			while (aliases.length > 0) {
				out[aliases.shift()] = out[k];
			}
		}
	}

	return out;
}
