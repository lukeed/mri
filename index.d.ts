type Dict<T> = Record<string, T>;
type Arrayable<T> = T | readonly T[];
type Default = Dict<any>;

declare function mri<T=Default>(args?: string[], options?: mri.Options<T>): mri.Argv<T>;

declare namespace mri {
	export interface Options<D extends Dict<any> =Default> {
		boolean?: Arrayable<string>;
		string?: Arrayable<string>;
		alias?: Dict<Arrayable<string>>;
		default?: D;
		unknown?(flag: string): void;
	}

	export type Argv<T=Default> = T & {
		_: string[];
	}
}

export = mri;
