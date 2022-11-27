/* eslint-disable unicorn/no-object-as-default-parameter, unicorn/consistent-function-scoping*/
import { isObject, isNumber, isString, getType, isUndefined } from './types';
import { shuffleArr } from './utils';

function getRandomSubString(str: string, length: number) {
  if (!isString(str)) {
    throw new TypeError(`getRandomSubString(): first argument should be a string, current arg is ${getType(str)}`);
  }
  if (!isNumber(length)) {
    throw new TypeError(`getRandomSubString(): second argument should be a number, current arg is ${getType(length)}`);
  }

  return Array.from({ length })
    .map(() => str.charAt(Math.floor(Math.random() * str.length)))
    .join('');
}

type IOptions = {
  numbers?: boolean;
  letters?: boolean;
  lettersAndNumbers?: boolean;
  symbols?: boolean;
  lettersNumbersAndSymbols?: boolean;
  lowerCase?: boolean;
};
function getRandomString(length, opts: IOptions = { letters: true }) {
  const allowedOptions = new Set(['numbers', 'letters', 'lettersAndNumbers', 'symbols', 'lettersNumbersAndSymbols']);

  const thowOptsError = () => {
    throw new Error(`getRandomString(): second argument should be an object with next opts
        numbers?: boolean;
        lettersAndNumbers?: boolean;
        symbols?: boolean;
        lettersNumbersAndSymbols?: boolean;
        lowerCase?: boolean;
    `);
  };

  if (!isObject(opts)) {
    thowOptsError();
  }

  const options = { ...opts };

  if (!Object.keys(options).some(k => allowedOptions.has(k) && options[k])) {
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

  if (!isNumber(length)) {
    throw new Error(`getRandomString(): first argument should be a number, current arg is ${getType(length)}`);
  }

  const { lowerCase, ...restOpts } = options;

  const optsKeys = Object.keys(restOpts);

  if (!optsKeys.length || !data[optsKeys[0]]) {
    thowOptsError();
  }

  const charsKey = optsKeys[0] || 'letters';

  const randomStr = getRandomSubString(data[charsKey], length);

  return lowerCase ? randomStr.toLowerCase() : randomStr;
}

function getRandomArrayItem<T>(t: T[]): T;

function getRandomArrayItem<T>(t: T[], quaintity: number): T[];

function getRandomArrayItem<T>(itemsList: T[], quaintity?: number): T | T[] {
  if (isUndefined(quaintity)) {
    quaintity = 1;
  }
  if (!Array.isArray(itemsList)) {
    throw new TypeError(
      `getRandomArrayItem(): first argument should be an array, current arg is ${getType(itemsList)}`,
    );
  }

  if (!itemsList.length) {
    throw new RangeError(`getRandomArrayItem(): given array is empty`);
  }

  if (quaintity > itemsList.length) {
    throw new RangeError(
      `getRandomArrayItem(): more elements taken: ${quaintity} than exist within the given array. Array length ${itemsList.length}`,
    );
  }

  if (quaintity === 1) {
    return itemsList[Math.floor(Math.random() * itemsList.length)] as T;
  }

  return shuffleArr(itemsList).slice(0, quaintity) as T[];
}

export { getRandomString, getRandomSubString, getRandomArrayItem };
