import {isObject, isNumber, getType} from './types';

const getStr = (str, length) => {
  return Array.from({length})
    .map(() => str.charAt(Math.floor(Math.random() * str.length)))
    .join('');
};

interface IOptions {
  numbers?: boolean;
  lettersAndNumbers?: boolean;
  symbols?: boolean;
  lettersNumbersAndSymbols?: boolean;
  lowerCase?: boolean;
}

function getRandomString(length, options: IOptions = {}) {
  const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const s = '!@#$%^&*(((()))_+~?>"|\\}{[]';
  const n = '01234567890';
  const ln = l + n;
  const lns = l + s + n;

  if (!isNumber(length)) {
    throw new Error(`getRandomString(): first argument should be a number, current arg is ${getType(length)}`);
  }

  if (!isObject(options)) {
    throw new Error(`getRandomString(): second argument should be an object, current arg is ${getType(options)}`);
  }

  const {lowerCase, ...restOpts} = options;

  const data = {
    letters: l,
    numbers: n,
    lettersAndNumbers: ln,
    symbols: s,
    lettersNumbersAndSymbols: lns,
  };

  const optsKeys = Object.keys(restOpts);

  if (optsKeys.length && !data[optsKeys[0]]) {
    throw new Error(`getRandomString(): second argument should be an object with next opts
      numbers?: boolean;
      lettersAndNumbers?: boolean;
      symbols?: boolean;
      lettersNumbersAndSymbols?: boolean;
    `);
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

export {getRandomString, getRandomArrayItem, toArray};
