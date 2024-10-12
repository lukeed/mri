type Dict<T> = Record<string, T>;
type Prettify<T> = { [K in keyof T]: T[K] } & {};

declare function mri<
	T = void,
	const O extends mri.Options = mri.Options,
>(
	args?: string[],
	options?: O,
): mri.Argv<T, O>;

declare namespace mri {
	export interface Options {
		string?: string | string[];
		boolean?: string | string[];
		alias?: Dict<string | string[]>;
		default?: Dict<any>;
		unknown?(flag: string): void;
	}

	export type Argv<
		T = void,
		O extends Options = Options,
	> =
		& { _: string[] }
		& (
			T extends void ? Infer<O> : T
		);

	// ---

	type Infer<O extends Options> = Prettify<
		& Defaults<O>
		& read<O["string"], string>
		& read<O["boolean"], boolean>
	>;

	type Defaults<O extends Options> = {
		-readonly [K in keyof O["default"]]: toType<O["default"][K]>;
	};

	// remove constant value type
	type toType<V> = V extends number ? number
		: V extends boolean ? boolean
		: V extends string ? string
		: unknown;

	type read<K extends undefined | string | string[], V> = K extends string
		? read<[K], V>
		: K extends string[] ? { [_ in K[number]]?: V }
		: never;
}

export = mri;
