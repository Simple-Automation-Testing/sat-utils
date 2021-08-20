# The purpose of this library is combine utils functions/methods/validators in one place

![npm downloads](https://img.shields.io/npm/dm/sat-utils.svg?style=flat-square)

## Content
- [waitForCondition](#waitforcondition)
- [getRandomString](#getrandomstring)
- [isArray](#isarray)
- [isObject](#isobject)
- [isNull](#isnull)
- [isSet](#isset)
- [isMap](#ismap)
- [isUndefined](#isundefined)
- [isNumber](#isnumber)
- [isPromise](#ispromise)
- [isBoolean](#isboolean)
- [isSymbol](#issymbol)
- [isFunction](#isfunction)
- [isAsyncFunction](#isasyncfunction)
- [isType](#istype)
- [getType](#gettype)
- [isPrimitive](#isprimitive)
- [canBeProxed](#canbeproxed)
- [toArray](#toarray)
- [shuffleArr](#shufflearr)

## waitForCondition
```js
	const {waitForCondition} = require('sat-utils')

	waitForCondition.setDefaultOpts({
		timeout: 2500, // default waiting time is 2500 ms
		interval: 250,	// default re-check condition interval time is 250 ms
		message: 'Failed',	// default error message is "Failed"
		waiterError: TypeError,	// default error is TypeError
	});

	test()
	async function test() {
		await waitForCondition(async () => {
			const result = await someAsyncLogic()
			return result;
		})
	}

	test1()
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
### getRandomArrayItem
```js
	const {getRandomArrayItem} = require('sat-utils')
	const firstItem = getRandomArrayItem([1,2,3,4]) // 2
	const [first, second] = getRandomArrayItem([1,2,3,4], 2) // [3, 1]
	getRandomArrayItem([1,2,3,4], 10) // => RangeError('getRandomArrayItem(): more elements taken ...
	getRandomArrayItem([]) // => RangeError('getRandomArrayItem(): given array is empty')
	getRandomArrayItem(null) // => TypeError('getRandomArrayItem(): first argument should be an')
```
## getRandomString
```js
	const {getRandomString} = require('sat-utils')
	const str1 = getRandomString(5) // AsRTl
	const str2 = getRandomString(5, {numbers: true}) // 09326
	const str3 = getRandomString(5, {lettersAndNumbers: true}) // 0B3a6
	const str4 = getRandomString(5, {symbols: true}) // !@#$^
	const str5 = getRandomString(5, {lettersNumbersAndSymbols: true}) // a2#B^
	const str6 = getRandomString(5, {lowerCase: true}) // abcd^


```
## sleep
```js
	const {sleep} = require('sat-utils')
	async function test() {
		await sleep(2500);
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
## isMap
```js
	const {isMap} = require('sat-utils')
	// any argument
	isMap(undefined) // => boolean
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
## isType
```js
	const {isType} = require('sat-utils')
	// any argument
	isType(undefined, 'function') // => boolean
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
## canBeProxed
```js
	const {canBeProxed} = require('sat-utils')
	// any argument
	canBeProxed(undefined) // => boolean
```
## toArray
```js
		const {toArray} = require('sat-utils')

		const arr1 = toArray(undefined) // []
		const arr2 = toArray(null) // [null]
		const arr3 = toArray([1,2,3]) // [1,2,3]
```

## shuffleArr
```js
		const {shuffleArr} = require('sat-utils')

		const arr1 = shuffleArr([2,3,1]) // [1,3,2]
		shuffleArr({}) // TypeError('shuffleArr(): first argument should be an array ...')

```