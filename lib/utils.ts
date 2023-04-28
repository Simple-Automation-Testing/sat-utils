/* eslint-disable sonarjs/cognitive-complexity, unicorn/no-object-as-default-parameter*/
import { isPrimitive, isArray, isNumber, getType, isString, isBoolean, isUndefined, isNull, isObject } from './types';

function toArray<T>(anyArugment: T | T[]): T[] {
  if (anyArugment === undefined) {
    return [];
  }

  return Array.isArray(anyArugment) ? Array.from(anyArugment) : [anyArugment];
}

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

  if (!followIndex) {
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
  } else {
    const chunkMax = Math.ceil(copied.length / chunksAmount);
    const chunkReg = Math.floor(copied.length / chunksAmount);

    const chunked = [];

    for (let i = 0; i < chunksAmount; i++) {
      chunked.push(copied.splice(0, i ? chunkReg : chunkMax));
    }

    return chunked.filter(chunk => chunk.length);
  }
}

function shuffleArrMutable<T>(arr: T[]): void {
  if (!Array.isArray(arr)) {
    throw new TypeError(`shuffleArrMutable(): first argument should be an array, current arg is ${getType(arr)}`);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function shuffleArr<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`shuffleArr(): first argument should be an array, current arg is ${getType(arr)}`);
  }
  const newArr = Array.from(arr);
  shuffleArrMutable(newArr);
  return newArr;
}

type TcamelCase = {
  firstWordUpperCase?: boolean;
  allUpperCase?: boolean;
  joinWords?: string;
};
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

function execNumberExpression(expression: string, numberArg: number) {
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

function safeJSONstringify(data: any, inline = false, returnIfError = '') {
  try {
    const shouldBeStringified = inline ? [data] : [data, null, '\t'];
    return JSON.stringify.apply(global, shouldBeStringified);
  } catch {
    return returnIfError;
  }
}

function safeJSONparse(data: any, returnIfError = {}) {
  try {
    return JSON.parse(data);
  } catch {
    return returnIfError;
  }
}

function safeHasOwnPropery(item: any, key: string): boolean {
  if (!isString(key)) {
    throw new TypeError(`safeHasOwnPropery(): second argument should be a string, current arg is ${getType(key)}`);
  }

  if (isUndefined(item) || isNull(item)) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(item, key);
}

function lengthToIndexesArray(length: number): number[] {
  if (!isNumber(length)) {
    throw new TypeError(`lengthToIndexes(): first argument should be a number, current arg is ${getType(length)}`);
  }
  return Array.from({ length }, (_item, index) => index);
}

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

function canBeStringified(item?: any): boolean {
  try {
    JSON.stringify(item);
    return true;
  } catch {
    return false;
  }
}

function getStringifyReadyData(data) {
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

function getStringifiedData(data) {
  const indent = '\t';

  if (isPrimitive(data)) {
    return String(data);
  }

  if (isArray(data)) {
    return (
      '[ ' +
      data
        .map((item, index, dataArr) => {
          const lineEnd = dataArr.length - 1 === index ? '\n' : ',\n';
          const value = getStringifiedData(item);

          return indent + value + lineEnd;
        })
        .join('') +
      ' ]'
    );
  }

  if (isObject(data)) {
    const keys = Object.getOwnPropertyNames(data);

    return (
      '{\n' +
      keys
        .map((key, index, objectKeys) => {
          const lineEnd = objectKeys.length - 1 === index ? '\n' : ',\n';

          const value = getStringifiedData(data[key]);

          return indent + key + ': ' + value + lineEnd;
        })
        .join('') +
      '\n}'
    );
  }
}

function requireModuleFromContent(src, filename = '') {
  const Module = module.constructor;
  // @ts-ignore
  const mod = new Module();
  mod._compile(src, filename);
  return mod.exports;
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
};
