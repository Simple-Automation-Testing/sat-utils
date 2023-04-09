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
- [isRegExp](#isregexp)
- [isSymbol](#issymbol)
- [isFunction](#isfunction)
- [isDate](#isdate)
- [isBuffer](#isbuffer)
- [isArguments](#isarguments)
- [isAsyncFunction](#isasyncfunction)
- [isType](#istype)
- [getType](#gettype)
- [isPrimitive](#isprimitive)
- [canBeProxed](#canbeproxed)
- [toArray](#toarray)
- [shuffleArr](#shufflearr)
- [shuffleArrMutable](#shufflearrmutable)
- [prettifyCamelCase](#prettifycamelcase)
- [isEmptyArray](#isemptyarray)
- [isEmptyObject](#isemptyobject)
- [isNotEmptyObject](#isnotemptyobject)
- [isNotEmptyArray](#isnotemptyarray)
- [execNumberExpression](#execnumberexpression)
- [compareToPattern](#comparetopattern)
- [getDirFilesList](#getdirfileslist)
- [safeJSONstringify](#safejsonstringify)
- [safeJSONparse](#safejsonparse)
- [camelize](#camelize)
- [safeHasOwnPropery](#safehasownpropery)
- [chunkArr](#chunkarr)
- [millisecondsToMinutes](#millisecondstominutes)
- [getRandomSubString](#getrandomsubstring)
- [lengthToIndexesArray](#lengthtoindexesarray)
- [getRandomNumberFromRange](#getrandomnumberfromrange)
- [asyncRepeat](#asyncrepeat)
- [asyncMap](#asyncmap)
- [asyncForEach](#asyncforeach)
- [asyncReduce](#asyncReduce)

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
  	message: (time) => throw new Error(`My custom error throw function with time ${time}`)
  })
	}
```

### getRandomArrayItem

```js
const { getRandomArrayItem } = require('sat-utils');
const firstItem = getRandomArrayItem([1, 2, 3, 4]); // 2
const [first, second] = getRandomArrayItem([1, 2, 3, 4], 2); // [3, 1]
getRandomArrayItem([1, 2, 3, 4], 10); // => RangeError('getRandomArrayItem(): more elements taken ...
getRandomArrayItem([]); // => RangeError('getRandomArrayItem(): given array is empty')
getRandomArrayItem(null); // => TypeError 'getRandomArrayItem(): first argument should be an')
```

## getRandomString

```js
const { getRandomString } = require('sat-utils');
const str1 = getRandomString(5); // AsRTl
const str2 = getRandomString(5, { numbers: true }); // 09326
const str3 = getRandomString(5, { lettersAndNumbers: true }); // 0B3a6
const str4 = getRandomString(5, { symbols: true }); // !@#$^
const str5 = getRandomString(5, { lettersNumbersAndSymbols: true }); // a2#B^
const str6 = getRandomString(5, { lowerCase: true }); // abcd^
```

## sleep

```js
const { sleep } = require('sat-utils');
async function test() {
  await sleep(2500);
}
```

## isArray

```js
const { isArray } = require('sat-utils');
// any argument
isArray(undefined); // => boolean
```

## isObject

```js
const { isObject } = require('sat-utils');
// any argument
isObject(undefined); // => boolean
```

## isRegExp

```js
const { isRegExp } = require('sat-utils');
// any argument
isRegExp(/a/gi); // => boolean
```

## isNull

```js
const { isNull } = require('sat-utils');
// any argument
isNull(undefined); // => boolean
```

## isString

```js
const { isString } = require('sat-utils');
// any argument
isString(undefined); // => boolean
```

## isSet

```js
const { isSet } = require('sat-utils');
// any argument
isSet(undefined); // => boolean
```

## isMap

```js
const { isMap } = require('sat-utils');
// any argument
isMap(undefined); // => boolean
```

## isUndefined

```js
const { isUndefined } = require('sat-utils');
// any argument
isUndefined(undefined); // => boolean
```

## isNumber

```js
const { isNumber } = require('sat-utils');
// any argument
isNumber(undefined); // => boolean
```

## isPromise

```js
const { isPromise } = require('sat-utils');
// any argument
isPromise(undefined); // => boolean
```

## isBuffer

```js
const { isBuffer } = require('sat-utils');
// any argument
isBuffer(undefined); // => boolean
```

## isBoolean

```js
const { isBoolean } = require('sat-utils');
// any argument
isBoolean(undefined); // => boolean
```

## isSymbol

```js
const { isSymbol } = require('sat-utils');
// any argument
isSymbol(undefined); // => boolean
```

## isFunction

```js
const { isFunction } = require('sat-utils');
// any argument
isFunction(undefined); // => boolean
```

## isDate

```js
const { isDate } = require('sat-utils');
// any argument
isDate(new Date()); // => boolean
```

## isArguments

```js
const { isArguments } = require('sat-utils');
// any argument
isArguments(new Date()); // => boolean
```

## isAsyncFunction

```js
const { isAsyncFunction } = require('sat-utils');
// any argument
isAsyncFunction(undefined); // => boolean
```

## isType

```js
const { isType } = require('sat-utils');
// any argument
isType(undefined, 'function'); // => boolean
```

## getType

```js
const { getType } = require('sat-utils');
// any argument
getType(undefined); // => string
```

## isPrimitive

```js
const { isPrimitive } = require('sat-utils');
// any argument
isPrimitive(undefined); // => boolean
```

## canBeProxed

```js
const { canBeProxed } = require('sat-utils');
// any argument
canBeProxed(undefined); // => boolean
```

## toArray

```js
const { toArray } = require('sat-utils');

const arr1 = toArray(undefined); // []
const arr2 = toArray(null); // [null]
const arr3 = toArray([1, 2, 3]); // [1,2,3]
```

## shuffleArr

```js
const { shuffleArr } = require('sat-utils');

const arr1 = shuffleArr([2, 3, 1]); // [1,3,2]
shuffleArr({}); // TypeError 'shuffleArr(): first argument should be an array ...'
```

## shuffleArrMutable

```js
const { shuffleArrMutable } = require('sat-utils');

const arr = [1, 2, 3, 4, 5];
shuffleArrMutable(arr);

console.log(arr); // [ 5, 2, 4, 1, 3 ]

shuffleArrMutable({}); // TypeError 'shuffleArr(): first argument should be an array ...'
```

## prettifyCamelCase

```js
const { prettifyCamelCase } = require('sat-utils');

const res1 = prettifyCamelCase(str); // Prettify Camel Case
const res2 = prettifyCamelCase(str, { joinWords: '__' }); // Prettify__Camel__Case
const res3 = prettifyCamelCase(str, { allUpperCase: true, joinWords: '_' }); // PRETTIFY_CAMEL_CASE
const res4 = prettifyCamelCase(str, { firstWordUpperCase: true }); // Prettify camel case
```

## isEmptyArray

```js
const { isEmptyArray } = require('sat-utils');

const isEmpty = isEmptyArray([]); // true
const isEmpty1 = isEmptyArray([1]); // false
const isEmpty2 = isEmptyArray(null); // false
const isEmpty3 = isEmptyArray({}); // false
```

## isNotEmptyArray

```js
const { isNotEmptyArray } = require('sat-utils');

const isEmpty = isNotEmptyArray([]); // false
const isEmpty1 = isNotEmptyArray([1]); // true
const isEmpty2 = isNotEmptyArray(null); // false
const isEmpty3 = isNotEmptyArray({}); // false
```

## isEmptyObject

```js
const { isEmptyObject } = require('sat-utils');

const isEmpty = isEmptyObject({}); // true
const isEmpty1 = isEmptyObject({ a: 1 }); // false
const isEmpty2 = isEmptyObject([]); // false
const isEmpty3 = isEmptyObject([1]); // false
const isEmpty4 = isEmptyObject(null); // false
```

## isEmptyObject

```js
const { isNotEmptyObject } = require('sat-utils');

const isEmpty = isNotEmptyObject({}); // false
const isEmpty1 = isNotEmptyObject({ a: 1 }); // true
const isEmpty2 = isNotEmptyObject([]); // false
const isEmpty3 = isNotEmptyObject([1]); // false
const isEmpty4 = isNotEmptyObject(null); // false
```

## execNumberExpression

```js
const { execNumberExpression } = require('sat-utils');

const isTruly = execNumberExpression('>10', 11); // true
const isTruly1 = execNumberExpression('>10 and <12', 11); // true
const isTruly2 = execNumberExpression('>10 and <13 and !== 12', 11); // true
const isTruly3 = execNumberExpression('<9', 11); // false
const isTruly4 = execNumberExpression('!==11', 11); // false
```

## compareToPattern

```js
const { compareToPattern } = require('sat-utils');
//
{
  const data = {
    a: { text: 'first' },
    b: { c: { d: { text: 'second' } } },
  };

  const pattern = {
    b: { c: { d: { text: /.*/ } } },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is true, message is ''
}
{
  const data = {
    a: { text: 'first' },
    b: { c: { d: { text: 'second' } } },
  };

  const pattern = {
    b: { c: { d: { text: 'second' } } },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is true, message is ''
}
{
  const data = {
    a: { text: 'first' },
    b: { c: { d: { text: 'first' } } },
  };

  const pattern = {
    b: { c: { d: { text: 'second' } } },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is false, message is 'b->c->d->text->Message: expected: second, actual: first'
}
{
  const data = {
    a: { text: 'first' },
    b: { c: [{ d: [{ text: 'first' }] }] },
  };

  const pattern = {
    b: { c: { d: { text: 'second' } } },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is false, message is 'b->c->d[0]->text[0]->Message: expected: second, actual: first'
}
{
  const data = {
    a: { text: 'first' },
    b: { c: [{ d: [{ text: 'first' }] }] },
  };

  const pattern = {
    b: { c: { length: 3, d: { text: 'second' } } },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is false, message is 'false b->c->Message: expected length: 3, actual lenght: 1'
}
{
  const data = {
    a: { text: 'first' },
    b: { c: [{ d: [{ text: 'first 1' }, { text: 'first 2' }, { text: 'first 3' }] }] },
  };

  const pattern = {
    b: { c: { d: { text: 'first' } } },
  };

  const { result, message } = compareToPattern(data, pattern, {
    stringIncludes: true,
  });
  // result is true, message is ''
}
{
  const data = {
    a: { text: 'first' },
    b: { c: [{ d: [{ text: 'first 1' }, { text: 'first 2' }, { text: 'first 3' }] }] },
  };

  const pattern = {
    b: { c: { d: { text: 'first 2' } } },
  };

  const { result, message } = compareToPattern(data, pattern, {
    everyArrayItem: false,
  });
  // result is true, message is ''
}
{
  const data = {
    a: { text: 'first' },
  };

  const pattern = {
    a: { text: compareToPattern.patternToLowercase('FIRST') },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is true, message is ''
}
{
  const data = {
    a: { text: 'FIRST' },
  };

  const pattern = {
    a: { text: compareToPattern.dataToUppercase('first') },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is true, message is ''
}
{
  const data = {
    a: { text: 'FIRST' },
  };

  const pattern = {
    a: { text: compareToPattern.patternToUppercase('first') },
  };

  const { result, message } = compareToPattern(data, pattern);
  // result is true, message is ''
}
```

## getDirFilesList

```js
const { getDirFilesList } = require('sat-utils');
const files = getDirFilesList('./node_modules'); // all absolute file pathes in node_module folder
```

## safeJSONstringify

```js
const { safeJSONstringify } = require('sat-utils');
console.log(safeJSONstringify({}));
console.log(safeJSONstringify(Object));
console.log(safeJSONstringify(new Proxy()));
```

## safeJSONparse

```js
const { safeJSONparse } = require('sat-utils');
console.log(safeJSONparse('{}'));
console.log(safeJSONstringify('dsadas dasda', {}));
```

## camelize

```js
const { camelize } = require('sat-utils');
console.log(camelize('here is my camel string')); // hereIsMyCamelString
```

## safeHasOwnPropery

```js
const { safeHasOwnPropery } = require('sat-utils');

safeHasOwnPropery({ a: 1 }, 'a'); // true
safeHasOwnPropery({ a: 1 }, 'b'); // false
safeHasOwnPropery(undefined, 'b'); // false
safeHasOwnPropery(null, 'b'); // false
safeHasOwnPropery(function test() {
  /** */
}, 'name'); // true
```

## chunkArr

```js
const { chunkArr } = require('sat-utils');

chunkArr([1, 2, 3], 2); // [[1, 3], [2]]
chunkArr([1, 2, 3], 2, true); // [[1, 2], [3]]
```

## millisecondsToMinutes

```js
const { millisecondsToMinutes } = require('sat-utils');

millisecondsToMinutes(100_000); // 1:40
```

## getRandomSubString

```js
const { getRandomSubString } = require('sat-utils');

getRandomSubString('abcdefgj', 3); // fgf
```

## millisecondsToMinutes

```js
const { millisecondsToMinutes } = require('sat-utils');

millisecondsToMinutes(100_000); // 1:40
```

## lengthToIndexesArray

```js
const { lengthToIndexesArray } = require('sat-utils');

lengthToIndexesArray(3); // [0,1,2]
```

## getRandomNumberFromRange

```js
const { getRandomNumberFromRange } = require('sat-utils');

getRandomNumberFromRange(1, 10); // 9
```

## asyncRepeat

```js
const { asyncRepeat } = require('sat-utils');

asyncRepeat(5, async () => {
  /* async logic will be executed 5 times */
});
```

## asyncMap

```js
const { asyncMap } = require('sat-utils');

asyncMap([1, 2, 3], async (item, index, arr) => item + index).then(console.log);
```

## asyncForEach

```js
const { asyncForEach } = require('sat-utils');

asyncForEach([1, 2, 3], async (item, index, arr) => console.log(item, index, arr));
```

## asyncReduce

```js
const { asyncReduce } = require('sat-utils');

asyncReduce([1, 2, 3], (acc, item) => new Promise(res => setTimeout(() => res(acc + item), 25)), 1).then(console.log); // 7
```
