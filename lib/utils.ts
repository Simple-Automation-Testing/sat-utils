import {isObject, isNumber, getType, isString, isBoolean} from './types';

const getStr = (str, length) => {
  return Array.from({length})
    .map(() => str.charAt(Math.floor(Math.random() * str.length)))
    .join('');
};

interface IOptions {
  numbers?: boolean;
  letters?: boolean;
  lettersAndNumbers?: boolean;
  symbols?: boolean;
  lettersNumbersAndSymbols?: boolean;
  lowerCase?: boolean;
}

function getRandomString(length, opts: IOptions = {letters: true}) {
  const allowedOptions = ['numbers', 'letters', 'lettersAndNumbers', 'symbols', 'lettersNumbersAndSymbols'];
  const options = {...opts};

  if (!Object.keys(options).some((k) => allowedOptions.includes(k) && options[k])) {
    options['letters'] = true;
  }

  const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const s = '!@#$%^&*(((()))_+~?>"|\\}{[]';
  const n = '01234567890';
  const ln = l + n;
  const lns = l + s + n;

  const data = {
    letters: l,
    numbers: n,
    lettersAndNumbers: ln,
    symbols: s,
    lettersNumbersAndSymbols: lns,
  };

  const thowOptsError = () => {
    throw new Error(`getRandomString(): second argument should be an object with next opts
        numbers?: boolean;
        lettersAndNumbers?: boolean;
        symbols?: boolean;
        lettersNumbersAndSymbols?: boolean;
        lowerCase?: boolean;
    `);
  };

  if (!isNumber(length)) {
    throw new Error(`getRandomString(): first argument should be a number, current arg is ${getType(length)}`);
  }

  if (!isObject(options)) {
    thowOptsError();
  }

  const {lowerCase, ...restOpts} = options;

  const optsKeys = Object.keys(restOpts);

  if (!optsKeys.length || !data[optsKeys[0]]) {
    thowOptsError();
  }

  const charsKey = optsKeys[0] || 'letters';

  const randomStr = getStr(data[charsKey], length);

  return lowerCase ? randomStr.toLowerCase() : randomStr;
}

function getRandomArrayItem(itemsList: any[], quaintity = 1): any | any[] {
  if (!Array.isArray(itemsList)) {
    throw new TypeError(`getRandomArrayItem(): first argument should be an array, current arg is ${getType(itemsList)}`);
  }

  if (!itemsList.length) {
    throw new RangeError(`getRandomArrayItem(): given array is empty`);
  }
  if (quaintity > itemsList.length) {
    throw new RangeError(
      `getRandomArrayItem(): more elements taken: ${quaintity} than exist within the given array. Array length ${itemsList.length}`,
    );
  }

  return quaintity > 1
    ? [...itemsList].sort(() => 0.5 - Math.random()).slice(0, quaintity)
    : itemsList[Math.floor(Math.random() * itemsList.length)];
}

function toArray(anyArugment): any[] {
  if (anyArugment === undefined) {
    return [];
  }

  return Array.isArray(anyArugment) ? Array.from(anyArugment) : [anyArugment];
}


function shuffleArr(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`shuffleArr(): first argument should be an array, current arg is ${getType(arr)}`);
  }
  const newArr = Array.from(arr);

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function prettifyCamelCase(camelCaseString: string): string {
  if (!isString(camelCaseString)) {
    throw new TypeError(`prettifyCamelCase(): first argument should be a string, current arg is ${getType(camelCaseString)}`);
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
    throw new TypeError(`checkNumberExpression(): first argument should be a string, current arg is ${getType(numberArg)}`);
  }
  if (!isNumber(numberArg)) {
    throw new TypeError(`checkNumberExpression(): second argument should be a number, current arg is ${getType(numberArg)}`);
  }


  try {
    const expressions = expression.toLowerCase().split('and');

    return expressions.every((expressionPart) => eval(`${numberArg} ${expressionPart}`));
  } catch (e) {
    return false;
  }
}

const prettifyCamelCaseToDelimeter = (name, delimeter = '_', allToUpper = false) => {
  if (!isString(name)) {
    throw new TypeError(`prettifyCamelCaseToDelimeter(): first argument should be a string, current arg is ${getType(name)}`);
  }
  if (!isString(delimeter)) {
    throw new TypeError(`prettifyCamelCaseToDelimeter(): second argument should be a string, current arg is ${getType(delimeter)}`);
  }
  if (!isBoolean(allToUpper)) {
    throw new TypeError(`prettifyCamelCaseToDelimeter(): third argument should be a string, current arg is ${getType(allToUpper)}`);
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
};

export {
  getRandomString,
  getRandomArrayItem,
  toArray,
  shuffleArr,
  prettifyCamelCase,
  execNumberExpression,
  prettifyCamelCaseToDelimeter,
};
