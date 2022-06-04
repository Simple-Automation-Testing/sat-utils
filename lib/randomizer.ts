import { isObject, isNumber, getType } from './types';

function getRandomSubString(str: string, length: number) {
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
  const allowedOptions = ['numbers', 'letters', 'lettersAndNumbers', 'symbols', 'lettersNumbersAndSymbols'];
  const options = { ...opts };

  if (!Object.keys(options).some(k => allowedOptions.includes(k) && options[k])) {
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

  const { lowerCase, ...restOpts } = options;

  const optsKeys = Object.keys(restOpts);

  if (!optsKeys.length || !data[optsKeys[0]]) {
    thowOptsError();
  }

  const charsKey = optsKeys[0] || 'letters';

  const randomStr = getRandomSubString(data[charsKey], length);

  return lowerCase ? randomStr.toLowerCase() : randomStr;
}

function getRandomArrayItem(itemsList: any[], quaintity = 1) {
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

  return quaintity > 1
    ? [...itemsList].sort(() => 0.5 - Math.random()).slice(0, quaintity)
    : itemsList[Math.floor(Math.random() * itemsList.length)];
}

export { getRandomString, getRandomSubString, getRandomArrayItem };
