# vet [![Build Status](https://travis-ci.org/lukeed/vet.svg?branch=master)](https://travis-ci.org/lukeed/vet)

> Quick vetting for CLI flags and arguments

This is a *very* basic, fast, and lightweight alternative to [`minimist`](https://github.com/substack/minimist). It only exists because I find that I usually don't need most of what `minimist` has to offer.

For now, there's no configuration options. Instead, `vet` just parses raw CLI flags (single or group) and assigns a value to those keys.

> **Note:** Defaults, aliases, and type-casting are not supported. However, this _may_ change in the future. :thinking:


## Install

```
$ npm install --save vet
```


## Usage

```sh
$ demo-cli --foo --bar=baz -mtv -- hello world
```

```js
const vet = require('vet');

const args = process.argv.slice(2);

vet(args);
//=> { _: ['hello', 'world'], foo:true, bar:'baz', m:true, t:true, v:true }
```

## API

### vet(args)

#### args

Type: `array`<br>
Default: `[]`

An array of arguments to parse. For CLI usage, send `process.argv.slice(2)`. See [`process.argv`](https://nodejs.org/docs/latest/api/process.html#process_process_argv) for info.


## License

MIT © [Luke Edwards](https://lukeed.com)
