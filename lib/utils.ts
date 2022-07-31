import { isNumber, getType, isString, isBoolean, isUndefined, isNull } from './types';

function toArray(anyArugment) {
  if (anyArugment === undefined) {
    return [];
  }

  return Array.isArray(anyArugment) ? Array.from(anyArugment) : [anyArugment];
}

function chunkArr(arr: any[], chunksAmount: number, followIndex: boolean = false) {
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

function shuffleArrMutable(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`shuffleArrMutable(): first argument should be an array, current arg is ${getType(arr)}`);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function shuffleArr(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`shuffleArr(): first argument should be an array, current arg is ${getType(arr)}`);
  }
  const newArr = Array.from(arr);
  shuffleArrMutable(newArr);
  return newArr;
}

function prettifyCamelCase(camelCaseString: string, onlyFirstWordInUpperCase = false): string {
  if (!isString(camelCaseString)) {
    throw new TypeError(
      `prettifyCamelCase(): first argument should be a string, current arg is ${getType(camelCaseString)}`,
    );
  }
  if (!isBoolean(onlyFirstWordInUpperCase)) {
    throw new TypeError(
      `prettifyCamelCase(): second argument should be a boolean, current arg is ${getType(onlyFirstWordInUpperCase)}`,
    );
  }

  let humanReadableString = '';

  for (let index = 0; index < camelCaseString.length; index++) {
    const char = camelCaseString.charAt(index);

    if (index === 0) {
      humanReadableString += char.toUpperCase();
    } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
      humanReadableString += ` ${char}`;
    } else {
      humanReadableString += char;
    }
  }

  return onlyFirstWordInUpperCase
    ? humanReadableString
        .split(' ')
        .map((word, index) => (index === 0 ? word : word.toLocaleLowerCase()))
        .join(' ')
    : humanReadableString;
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

function prettifyCamelCaseToDelimeter(name, delimeter = '_', allToUpper = false) {
  if (!isString(name)) {
    throw new TypeError(
      `prettifyCamelCaseToDelimeter(): first argument should be a string, current arg is ${getType(name)}`,
    );
  }
  if (!isString(delimeter)) {
    throw new TypeError(
      `prettifyCamelCaseToDelimeter(): second argument should be a string, current arg is ${getType(delimeter)}`,
    );
  }
  if (!isBoolean(allToUpper)) {
    throw new TypeError(
      `prettifyCamelCaseToDelimeter(): third argument should be a string, current arg is ${getType(allToUpper)}`,
    );
  }
  return name
    .split('')
    .map((char: string) => {
      const isInUpper = char !== char.toLowerCase();
      const toEndView = allToUpper ? char.toUpperCase() : char.toLowerCase();
      if (isInUpper) {
        return `${delimeter}${toEndView}`;
      }
      return toEndView;
    })
    .join('');
}

function camelize(str) {
  if (!isString(str)) {
    throw new TypeError(`camelize(): first argument should be a string, current arg is ${getType(str)}`);
  }

  return str
    .replace(/^\w|[A-Z]|\b\w/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

function safeJSONstringify(data, inline = false, returnIfError = '') {
  try {
    const shouldBeStringified = inline ? [data] : [data, null, '\t'];
    return JSON.stringify.apply(global, shouldBeStringified);
  } catch {
    return returnIfError;
  }
}

function safeHasOwnPropery(item: any, key: string) {
  if (!isString(key)) {
    throw new TypeError(`safeHasOwnPropery(): second argument should be a string, current arg is ${getType(key)}`);
  }

  if (isUndefined(item) || isNull(item)) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(item, key);
}

export {
  toArray,
  prettifyCamelCase,
  prettifyCamelCaseToDelimeter,
  execNumberExpression,
  camelize,
  safeJSONstringify,
  shuffleArr,
  shuffleArrMutable,
  safeHasOwnPropery,
  chunkArr,
};
