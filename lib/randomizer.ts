/* eslint-disable no-console */
/* eslint-disable unicorn/no-object-as-default-parameter, unicorn/consistent-function-scoping*/
import { isObject, isNumber, isString, getType, isUndefined, isPrimitive } from './types';
import { shuffleArr, toArray } from './utils';

type IOptions = {
  numbers?: boolean;
  letters?: boolean;
  lettersAndNumbers?: boolean;
  symbols?: boolean;
  lettersNumbersAndSymbols?: boolean;
  lowerCase?: boolean;
};

/**
 * Get a random substring of a given string.
 *
 * @param {string} str - The input string.
 * @param {number} length - The length of the random substring.
 * @returns {string} The random substring.
 * @throws {TypeError} If the input arguments are not of the expected types.
 */
function getRandomSubString(str, length) {
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

/**
 * Options for generating a random string.
 *
 * @typedef {Object} IOptions
 * @property {boolean} [numbers] - Include numbers.
 * @property {boolean} [letters] - Include letters.
 * @property {boolean} [lettersAndNumbers] - Include letters and numbers.
 * @property {boolean} [symbols] - Include symbols.
 * @property {boolean} [lettersNumbersAndSymbols] - Include letters, numbers, and symbols.
 * @property {boolean} [lowerCase] - Convert the result to lowercase.
 */

/**
 * Get a random string of a specified length and options.
 *
 * @param {number} length - The length of the random string.
 * @param {IOptions} [opts] - Options for generating the random string.
 * @returns {string} The random string.
 * @throws {TypeError} If the input arguments are not of the expected types.
 */
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

/**
 * Get a random item from an array or an array of random items.
 *
 * @param {T[]} itemsList - The array of items.
 * @param {number} [quaintity] - The quantity of random items to get.
 * @returns {T|T[]} A random item or an array of random items.
 * @throws {TypeError} If the input arguments are not of the expected types.
 * @throws {RangeError} If the input arguments are out of range or invalid.
 */
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

/**
 * Retrieves unique items from the given array based on specified fields.
 * @template T - The type of items in the array.
 * @param {T[]} itemsList - The array of items to be processed.
 * @param {symbol | string | string[]} [uniqByFields] - Optional. The field(s) based on which uniqueness is determined.
 * @returns {T[]} The array containing unique items based on the specified fields.
 * @throws {TypeError} If the first argument is not an array.
 */
function getUniqItems<T>(
  itemsList: T[],
  uniqByFields?: symbol | string | string[] | ((currentItems: T[], initalArrItem) => boolean),
): T[] {
  if (!Array.isArray(itemsList)) {
    throw new TypeError(`getUniqItems(): first argument should be an array`);
  }

  if (itemsList.length === 0) {
    return [];
  }

  if (itemsList.every(el => isPrimitive(el))) {
    return Array.from(new Set(itemsList));
  }

  if (uniqByFields) {
    const fields = toArray(uniqByFields);
    const uniqItems = [];

    for (const item of itemsList) {
      if (uniqItems.length === 0) {
        uniqItems.push(item);
      } else {
        const isUniq = uniqItems.every(uniqItem => {
          return fields.some(field => {
            if (typeof field === 'string' || typeof field === 'symbol') {
              return uniqItem[field] !== item[field];
            } else if (typeof field === 'function') {
              return field(Array.from(uniqItems), item);
            }
          });
        });

        if (isUniq) {
          uniqItems.push(item);
        }
      }
    }

    return uniqItems;
  }

  console.warn(`getUniqItems(): uniqByFields is not provided, returning original array without filtering`);

  return toArray(itemsList);
}

/**
 * Retrieves unique items from the given array based on specified fields.
 * @template T - The type of items in the array.
 * @param {T[]} itemsList - The array of items to be processed.
 * @param {symbol | string | string[]} [uniqByFields] - Optional. The field(s) based on which uniqueness is determined.
 * @returns {T[]} The array containing unique items based on the specified fields.
 * @throws {TypeError} If the first argument is not an array.
 */
function getNotUniqItems<T>(itemsList: T[], uniqByFields?: symbol | string | string[]): T[] {
  const seen = new Map<string, T[]>();
  const duplicates: T[] = [];

  if (!Array.isArray(itemsList)) {
    throw new TypeError(`getNotUniqItems(): first argument should be an array`);
  }
  if (itemsList.length === 0) {
    return [];
  }
  if (itemsList.every(el => isPrimitive(el))) {
    return itemsList.filter((item, index, self) => self.indexOf(item) !== index);
  }

  for (const item of itemsList) {
    const key = toArray(uniqByFields)
      .map(k => String(item[k]))
      .join('|'); // Unique composite key

    if (seen.has(key)) {
      seen.get(key)!.push(item);
    } else {
      seen.set(key, [item]);
    }
  }

  for (const group of seen.values()) {
    if (group.length > 1) {
      duplicates.push(...group);
    }
  }

  return duplicates;
}

export { getRandomString, getRandomSubString, getRandomArrayItem, getUniqItems, getNotUniqItems };
