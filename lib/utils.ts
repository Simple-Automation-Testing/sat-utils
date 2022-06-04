import { isNumber, getType, isString, isBoolean, isUndefined, isNull } from './types';

function toArray(anyArugment) {
  if (anyArugment === undefined) {
    return [];
  }

  return Array.isArray(anyArugment) ? Array.from(anyArugment) : [anyArugment];
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

  return shuffleArrMutable(Array.from(arr));
}

function prettifyCamelCase(camelCaseString: string): string {
  if (!isString(camelCaseString)) {
    throw new TypeError(
      `prettifyCamelCase(): first argument should be a string, current arg is ${getType(camelCaseString)}`,
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

  return humanReadableString;
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
  } catch (e) {
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
  execNumberExpression,
  prettifyCamelCaseToDelimeter,
  camelize,
  safeJSONstringify,
  shuffleArr,
  shuffleArrMutable,
  safeHasOwnPropery,
};
