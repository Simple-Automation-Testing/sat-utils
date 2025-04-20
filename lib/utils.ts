/* eslint-disable sonarjs/cognitive-complexity, unicorn/no-object-as-default-parameter, unicorn/prefer-string-replace-all*/

import {
  isPrimitive,
  isArray,
  isNumber,
  getType,
  isString,
  isBoolean,
  isUndefined,
  isNull,
  isObject,
  isFunction,
  isAsyncFunction,
} from './types';

type TcamelCase = {
  firstWordUpperCase?: boolean;
  allUpperCase?: boolean;
  joinWords?: string;
};

/**
 * Converts a value or an array of values to an array.
 *
 * @template T
 * @param {T | T[]} anyArgument - The value or array to convert.
 * @param {T | T[]} undefinedIsFine - Return arr with undefined member is argument is undefined
 * @returns {T[]} An array containing the input value(s).
 */
function toArray<T>(anyArgument: T | T[], undefinedIsFine: boolean = false): T[] {
  if (anyArgument === undefined) {
    return (undefinedIsFine ? [anyArgument] : []) as T[];
  }

  return Array.isArray(anyArgument) ? Array.from(anyArgument) : [anyArgument];
}

/**
 * Splits an array into multiple smaller arrays.
 *
 * @template T
 * @param {T[]} arr - The input array.
 * @param {number} chunksAmount - The number of smaller arrays to create.
 * @param {boolean} [followIndex=false] - If true, chunks will have approximately equal lengths; otherwise, they will be balanced.
 * @returns {Array<T[]>} An array of smaller arrays.
 * @throws {TypeError} If the input is not an array or the chunk size is not a number.
 */
function chunkArr<T>(arr: T[], chunksAmount: number, followIndex: boolean = false): Array<T[]> {
  if (!Array.isArray(arr)) {
    throw new TypeError(`chunkArr(): first argument should be an array, current arg is ${getType(arr)}`);
  }

  if (!isNumber(chunksAmount)) {
    throw new TypeError(`chunkArr(): second argument should be a number, current arg is ${getType(chunksAmount)}`);
  }

  if (!isBoolean(followIndex)) {
    throw new TypeError(`chunkArr(): third argument should be a boolean, current arg is ${getType(followIndex)}`);
  }

  const copied = toArray(arr);

  if (followIndex) {
    const chunkMax = Math.ceil(copied.length / chunksAmount);
    const chunkReg = Math.floor(copied.length / chunksAmount);

    const chunked = [];

    for (let i = 0; i < chunksAmount; i++) {
      chunked.push(copied.splice(0, i ? chunkReg : chunkMax));
    }

    return chunked.filter(chunk => chunk.length);
  } else {
    const chunked = Array.from({ length: chunksAmount }).map(() => []);

    let index = 0;

    for (const item of copied) {
      chunked[index].push(item);
      index++;

      if (index === chunked.length) {
        index = 0;
      }
    }

    return chunked.filter(chunk => chunk.length);
  }
}

/**
 * Shuffles an array in place.
 *
 * @template T
 * @param {T[]} arr - The array to shuffle.
 * @throws {TypeError} If the input is not an array.
 */
function shuffleArrMutable<T>(arr: T[]): void {
  if (!Array.isArray(arr)) {
    throw new TypeError(`shuffleArrMutable(): first argument should be an array, current arg is ${getType(arr)}`);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Shuffles a copy of an array.
 *
 * @template T
 * @param {T[]} arr - The input array.
 * @returns {T[]} A shuffled copy of the input array.
 * @throws {TypeError} If the input is not an array.
 */
function shuffleArr<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`shuffleArr(): first argument should be an array, current arg is ${getType(arr)}`);
  }
  const newArr = Array.from(arr);
  shuffleArrMutable(newArr);
  return newArr;
}

/**
 * Options for the prettifyCamelCase function.
 *
 * @typedef {Object} TcamelCase
 * @property {boolean} [firstWordUpperCase=false] - If true, the first word will start with an uppercase letter.
 * @property {boolean} [allUpperCase=false] - If true, the entire string will be in uppercase.
 * @property {string} [joinWords=' '] - The string to use for joining words.
 */

/**
 * Prettifies a camelCase string.
 *
 * @param {string} camelCaseString - The camelCase string to prettify.
 * @param {TcamelCase} [_opts] - Options for prettifying the string.
 * @returns {string} The prettified string.
 * @throws {TypeError} If the input is not a string or the options are not valid.
 */
function prettifyCamelCase(
  camelCaseString: string,
  _opts: TcamelCase = { firstWordUpperCase: false, joinWords: ' ' },
): string {
  const defaultOpts = { firstWordUpperCase: false, joinWords: ' ', allUpperCase: false };

  if (!isString(camelCaseString)) {
    throw new TypeError(
      `prettifyCamelCase(): first argument should be a string, current arg is ${getType(camelCaseString)}`,
    );
  }
  if (!isObject(_opts)) {
    throw new TypeError(`prettifyCamelCase(): second argument should be an object, current arg is ${getType(_opts)}`);
  }

  const opts = { ...defaultOpts, ..._opts };

  if (!isBoolean(opts.firstWordUpperCase)) {
    throw new TypeError(
      `prettifyCamelCase(): second argument  "firstWordUpperCase" property should be a boolean, current arg is ${getType(
        opts.firstWordUpperCase,
      )}`,
    );
  }

  if (!isBoolean(opts.allUpperCase)) {
    throw new TypeError(
      `prettifyCamelCase(): second argument  "allUpperCase" property should be a boolean, current arg is ${getType(
        opts.firstWordUpperCase,
      )}`,
    );
  }

  if (!isString(opts.joinWords)) {
    throw new TypeError(
      `prettifyCamelCase(): second argument  "joinWords" property should be a string, current arg is ${getType(
        opts.joinWords,
      )}`,
    );
  }

  const { firstWordUpperCase, joinWords, allUpperCase } = opts;

  let humanReadableString = '';

  for (let index = 0; index < camelCaseString.length; index++) {
    const char = camelCaseString.charAt(index);

    if (index === 0) {
      humanReadableString += char.toUpperCase();
    } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
      humanReadableString += `${joinWords}${char}`;
    } else {
      humanReadableString += char;
    }
  }

  const firstWordUp = firstWordUpperCase
    ? humanReadableString
        .split(' ')
        .map((word, index) => (index === 0 ? word : word.toLocaleLowerCase()))
        .join(' ')
    : humanReadableString;

  return allUpperCase ? firstWordUp.toUpperCase() : firstWordUp;
}

/**
 * Checks if a mathematical expression is true for a given number.
 *
 * @param {string} expression - The mathematical expression to evaluate.
 * @param {number} numberArg - The number to use in the expression.
 * @returns {boolean} True if the expression is true for the given number; otherwise, false.
 * @throws {TypeError} If the expression is not a string or the number is not a number.
 */
function execNumberExpression(expression: string, numberArg: number): boolean {
  if (!isString(expression)) {
    throw new TypeError(
      `checkNumberExpression(): first argument should be a string, current arg is ${getType(numberArg)}`,
    );
  }
  if (!isNumber(numberArg)) {
    throw new TypeError(
      `checkNumberExpression(): second argument should be a number, current arg is ${getType(numberArg)}`,
    );
  }

  try {
    const expressions = expression.toLowerCase().split('and');

    return expressions.every(expressionPart => eval(`${numberArg} ${expressionPart}`));
  } catch {
    return false;
  }
}

/**
 * Converts a string to camelCase.
 *
 * @param {string} str - The input string.
 * @returns {string} The string in camelCase.
 * @throws {TypeError} If the input is not a string.
 */
function camelize(str: string): string {
  if (!isString(str)) {
    throw new TypeError(`camelize(): first argument should be a string, current arg is ${getType(str)}`);
  }

  return str
    .replace(/^\w|[A-Z]|\b\w/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

/**
 * Safely converts an object to a JSON string.
 *
 * @param {*} data - The data to stringify.
 * @param {boolean} [inline=false] - If true, the resulting JSON will be on a single line.
 * @param {*} [returnIfError=''] - The value to return if an error occurs during stringification.
 * @returns {string} The JSON string or the specified return value if an error occurs.
 */
function safeJSONstringify(data: any, inline = false, returnIfError = ''): string {
  try {
    const shouldBeStringified = inline ? [data] : [data, null, '\t'];
    return JSON.stringify.apply(global, shouldBeStringified);
  } catch {
    return returnIfError;
  }
}

/**
 * Safely parses a JSON string.
 *
 * @param {*} data - The JSON string to parse.
 * @param {*} [returnIfError={}] - The value to return if an error occurs during parsing.
 * @returns {*} The parsed JSON object or the specified return value if an error occurs.
 */
function safeJSONparse(data: any, returnIfError = {}): any {
  try {
    return JSON.parse(data);
  } catch {
    return returnIfError;
  }
}

/**
 * Checks if an object has a specified property.
 *
 * @param {*} item - The object to check.
 * @param {string} key - The property key to check for.
 * @returns {boolean} True if the object has the property; otherwise, false.
 * @throws {TypeError} If the key is not a string.
 */
function safeHasOwnPropery(item: any, key: string): boolean {
  if (!isString(key)) {
    throw new TypeError(`safeHasOwnPropery(): second argument should be a string, current arg is ${getType(key)}`);
  }

  if (isUndefined(item) || isNull(item)) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(item, key);
}

/**
 * Generates an array of indexes from 0 to a specified length.
 *
 * @param {number} length - The length of the resulting array.
 * @returns {number[]} An array of indexes.
 * @throws {TypeError} If the length is not a number.
 */
function lengthToIndexesArray(length: number): number[] {
  if (!isNumber(length)) {
    throw new TypeError(`lengthToIndexes(): first argument should be a number, current arg is ${getType(length)}`);
  }
  return Array.from({ length }, (_item, index) => index);
}

/**
 * Generates a random number within a specified range.
 *
 * @param {number} min - The minimum value of the range (inclusive).
 * @param {number} max - The maximum value of the range (exclusive).
 * @returns {number} A random number within the specified range.
 * @throws {TypeError} If the min or max values are not numbers.
 */
function getRandomNumberFromRange(min: number, max: number): number {
  if (!isNumber(min)) {
    throw new TypeError(
      `getRandomNumberFromRange(): first argument should be a number, current arg is ${getType(min)}`,
    );
  }

  if (!isNumber(max)) {
    throw new TypeError(
      `getRandomNumberFromRange(): second argument should be a number, current arg is ${getType(min)}`,
    );
  }

  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Checks if an object can be safely converted to a JSON string.
 *
 * @param {*} item - The object to check.
 * @returns {boolean} True if the object can be converted to JSON; otherwise, false.
 */
function canBeStringified(item?: any): boolean {
  try {
    JSON.stringify(item);
    return true;
  } catch {
    return false;
  }
}

/**
 * Filters and returns an object with only stringifiable values.
 *
 * @param {*} data - The input data.
 * @returns {*} An object with only stringifiable values or an empty string if none are found.
 */
function getStringifyReadyData(data): any {
  if (isObject(data)) {
    const copied = {};

    for (const key of Object.keys(data)) {
      if (canBeStringified(data[key])) {
        copied[key] = data[key];
      }
    }

    return copied;
  }

  if (isArray(data)) {
    return data.map(data_item => getStringifyReadyData(data_item));
  }

  if (isPrimitive(data) && canBeStringified(data)) {
    return data;
  }

  return '';
}

type TstringifyDataConfig = {
  ignoreFunctions?: boolean;
};
/**
 * Converts an object to a string.
 *
 * @param {*} obj - The object to convert.
 * @param {TstringifyDataConfig} [config] - Configuration options.
 * @returns {string} The string representation of the object.
 */
function stringifyData(obj: unknown, config?: TstringifyDataConfig): string {
  if (isPrimitive(obj)) {
    return String(obj);
  }
  if (isFunction(obj) || isAsyncFunction(obj)) {
    return config?.ignoreFunctions ? 'function' : obj.toString();
  }

  if (isArray(obj)) {
    const arrString = (obj as unknown[]).map(item => stringifyData(item, config)).join(', ');
    return `[${arrString}]`;
  }

  const objString = Object.keys(obj)
    .map(key => `${key}: ${stringifyData(obj[key], config)}`)
    .join(', ');

  return `{${objString}}`;
}

type TgetStringEqualtyPersentage = {
  ignoreSpaces?: boolean;
  toLowerCase?: boolean;
  ignorePunctuation?: boolean;
};
/**
 * @param {string} str string to check percentage of the equality
 * @param {string} inStr string to check how many pecent is in str
 * @param {object} opts strings modification options
 * @returns {number} percentage of the equality
 */
function getStringEqualtyPersentage(str: string, inStr: string, opts?: TgetStringEqualtyPersentage) {
  const defaultOpts = {
    ignoreSpaces: false,
    toLowerCase: false,
    ignorePunctuation: false,
  };

  if (!isString(str)) {
    throw new TypeError(
      `getStringEqualtyPersentage(): first argument should be a string, current arg is ${getType(str)}`,
    );
  }

  if (!isString(inStr)) {
    throw new TypeError(
      `getStringEqualtyPersentage(): second argument should be a string, current arg is ${getType(inStr)}`,
    );
  }

  if (!isObject(opts) && !isUndefined(opts)) {
    throw new TypeError(
      `getStringEqualtyPersentage(): third argument should be an object, current arg is ${getType(opts)}`,
    );
  }

  const options = { ...defaultOpts, ...opts };

  if (!isBoolean(options.ignoreSpaces)) {
    throw new TypeError(
      `getStringEqualtyPersentage(): third argument "ignoreSpaces" property should be a boolean, current arg is ${getType(
        options.ignoreSpaces,
      )}`,
    );
  }

  if (!isBoolean(options.toLowerCase)) {
    throw new TypeError(
      `getStringEqualtyPersentage(): third argument "toLowerCase" property should be a boolean, current arg is ${getType(
        options.toLowerCase,
      )}`,
    );
  }

  if (!isBoolean(options.ignorePunctuation)) {
    throw new TypeError(
      `getStringEqualtyPersentage(): third argument "ignorePunctuation" property should be a boolean, current arg is ${getType(
        options.ignorePunctuation,
      )}`,
    );
  }

  let str1 = str;
  let str2 = inStr;

  if (options.ignoreSpaces) {
    str1 = str1.replace(/\s/g, '');
    str2 = str2.replace(/\s/g, '');
  }

  if (options.toLowerCase) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
  }

  if (options.ignorePunctuation) {
    const punctuationRegex = /[!#$%&()*,./:;=^_`{}~\-]/g;
    str1 = str1.replace(punctuationRegex, '');
    str2 = str2.replace(punctuationRegex, '');
  }

  const str1Arr = str1.split('');
  const str2Arr = str2.split('');
  const comparisonResults = [0];

  for (let i = 0; i < str1Arr.length; i++) {
    const charInStr = str1Arr[i];
    const slicedStr = str1Arr.slice(i);
    const indexInComarisonStr = str2Arr.indexOf(charInStr);
    // if the char is not in the comparison string, we can skip it
    if (indexInComarisonStr === -1 && i === 0) {
      return 0;
    }

    const sliced = str2Arr.slice(indexInComarisonStr);
    let equaltyCount = 0;

    for (const [j, element] of sliced.entries()) {
      if (element === slicedStr[j]) {
        equaltyCount++;
      } else {
        comparisonResults.push(equaltyCount);
        break;
      }
      comparisonResults.push(equaltyCount);
    }
  }

  const bigest = comparisonResults.sort()[comparisonResults.length - 1];

  return Number(((bigest / str2.length) * 100).toFixed(1));
}

export {
  toArray,
  prettifyCamelCase,
  execNumberExpression,
  camelize,
  safeJSONstringify,
  shuffleArrMutable,
  safeHasOwnPropery,
  shuffleArr,
  chunkArr,
  lengthToIndexesArray,
  getRandomNumberFromRange,
  getStringifyReadyData,
  canBeStringified,
  safeJSONparse,
  stringifyData,
  getStringEqualtyPersentage,
};
