# mri [![Build Status](https://travis-ci.org/lukeed/mri.svg?branch=master)](https://travis-ci.org/lukeed/mri)

> Quickly scan for CLI flags and arguments

This is a *very* basic, [fast](#benchmarks), and lightweight alternative to [`minimist`](https://github.com/substack/minimist). It only exists because I find that I usually don't need most of what `minimist` has to offer.

For now, there's no configuration options. Instead, `mri` just parses raw CLI flags (single or group) and assigns a value to those keys.

> **Note:** Defaults, aliases, and type-casting are not supported. However, this _may_ change in the future. :thinking:


## Install

```
$ npm install --save mri
```


## Usage

```sh
$ demo-cli --foo --bar=baz -mtv -- hello world
```

```js
const mri = require('mri');

const args = process.argv.slice(2);

mri(args);
//=> { _: ['hello', 'world'], foo:true, bar:'baz', m:true, t:true, v:true }
```

## API

### mri(args)

#### args

Type: `array`<br>
Default: `[]`

An array of arguments to parse. For CLI usage, send `process.argv.slice(2)`. See [`process.argv`](https://nodejs.org/docs/latest/api/process.html#process_process_argv) for info.


## Benchmarks

```
mri
  --> 330,717 ops/sec ±0.23% (92 runs sampled)
yargs
  --> 16,350 ops/sec ±0.49% (94 runs sampled)
minimist
  --> 134,554 ops/sec ±0.74% (90 runs sampled)
```


## License

MIT © [Luke Edwards](https://lukeed.com)
