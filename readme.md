## waitForCondition
```js
	const {waitForCondition} = require('sat-utils')

	test()
	waitForCondition.setDefaultOpts({timeout: 2500, interval: 250, message: 'Failed'});

	async function test() {
		await waitForCondition(async () => {
			const result = await someAsyncLogic()
			return result;
		})
	}

	async function test1() {
		await waitForCondition(async () => {
			const result = await someAsyncLogic()
			return result;
		}, {
			analyseResult: (result) => result.status === 200;
			timeout: 25000,
			interval: 250,
			throwCustom: () => throw new Error('My custom error throw function')
		})
	}
```

## isArray
```js
	const {isArray} = require('sat-utils')
	// any argument
	isArray(undefined) // => boolean
```
## isObject
```js
	const {isObject} = require('sat-utils')
	// any argument
	isObject(undefined) // => boolean
```
## isNull
```js
	const {isNull} = require('sat-utils')
	// any argument
	isNull(undefined) // => boolean
```
## isString
```js
	const {isString} = require('sat-utils')
	// any argument
	isString(undefined) // => boolean
```
## isSet
```js
	const {isSet} = require('sat-utils')
	// any argument
	isSet(undefined) // => boolean
```
## isUndefined
```js
	const {isUndefined} = require('sat-utils')
	// any argument
	isUndefined(undefined) // => boolean
```
## isNumber
```js
	const {isNumber} = require('sat-utils')
	// any argument
	isNumber(undefined) // => boolean
```
## isPromise
```js
	const {isPromise} = require('sat-utils')
	// any argument
	isPromise(undefined) // => boolean
```
## isBoolean
```js
	const {isBoolean} = require('sat-utils')
	// any argument
	isBoolean(undefined) // => boolean
```
## isSymbol
```js
	const {isSymbol} = require('sat-utils')
	// any argument
	isSymbol(undefined) // => boolean
```
## isFunction
```js
	const {isFunction} = require('sat-utils')
	// any argument
	isFunction(undefined) // => boolean
```
## isAsyncFunction
```js
	const {isAsyncFunction} = require('sat-utils')
	// any argument
	isAsyncFunction(undefined) // => boolean
```
## typesEnum
```js
	const {typesEnum} = require('sat-utils')
	// any argument
	typesEnum(undefined) // => boolean
```
## expectedArg
```js
	const {expectedArg} = require('sat-utils')
	// any argument
	expectedArg(undefined) // => boolean
```
## isType
```js
	const {isType} = require('sat-utils')
	// any argument
	isType(undefined) // => boolean
```
## getType
```js
	const {getType} = require('sat-utils')
	// any argument
	getType(undefined) // => boolean
```
## isPrimitive
```js
	const {isPrimitive} = require('sat-utils')
	// any argument
	isPrimitive(undefined) // => boolean
```
## canBeProxe
```js
	const {canBeProxe} = require('sat-utils')
	// any argument
	canBeProxe(undefined) // => boolean
```