/* eslint-disable sonarjs/cognitive-complexity */
import { isNull, isDate, isNumber, isString, isRegExp, isUndefined } from '../types';
import { execNumberExpression, safeHasOwnPropery } from '../utils';
import { getRandomString } from '../randomizer';

const { toDataIncludes, checkThatDataIncludes, removeDataIncludesId } = (function () {
  const checkIncludesId = `${getRandomString(7)}_data_includes=`;

  return {
    toDataIncludes: (item: string) => `${checkIncludesId}${item}`,
    checkThatDataIncludes: (item: string) => item.indexOf(checkIncludesId) === 0,
    removeDataIncludesId: (item: string) => item.replace(checkIncludesId, ''),
  };
})();

const { toPatternIncludes, checkThatPatternIncludes, removePatternIncludesId } = (function () {
  const patternIncludesId = `${getRandomString(7)}_pattern_includes=`;

  return {
    toPatternIncludes: (item: string) => `${patternIncludesId}${item}`,
    checkThatPatternIncludes: (item: string) => item.indexOf(patternIncludesId) === 0,
    removePatternIncludesId: (item: string) => item.replace(patternIncludesId, ''),
  };
})();

const { toCheckNumber, checkThatCheckNumber, removeCheckNumberId } = (function () {
  const patternIncludesId = `${getRandomString(7)}_check_number=`;

  return {
    toCheckNumber: (item: string) => `${patternIncludesId}${item}`,
    checkThatCheckNumber: (item: string) => item.indexOf(patternIncludesId) === 0,
    removeCheckNumberId: (item: string) => item.replace(patternIncludesId, ''),
  };
})();

const { dataToLowercase, checkThatDataLowercase, removeDataLowercase } = (function () {
  const patternIncludesId = `${getRandomString(7)}_data_lower=`;

  return {
    dataToLowercase: (item: string) => `${patternIncludesId}${item}`,
    checkThatDataLowercase: (item: string) => item.indexOf(patternIncludesId) === 0,
    removeDataLowercase: (item: string) => item.replace(patternIncludesId, ''),
  };
})();

const { patternToLowercase, checkThatPatternLowercase, removePatternLowercase } = (function () {
  const patternIncludesId = `${getRandomString(7)}_pattern_lower=`;

  return {
    patternToLowercase: (item: string) => `${patternIncludesId}${item}`,
    checkThatPatternLowercase: (item: string) => item.indexOf(patternIncludesId) === 0,
    removePatternLowercase: (item: string) => item.replace(patternIncludesId, ''),
  };
})();

const { dataToUppercase, checkThatDataUppercase, removeDataUppercase } = (function () {
  const patternIncludesId = `${getRandomString(7)}_data_upper=`;

  return {
    dataToUppercase: (item: string) => `${patternIncludesId}${item}`,
    checkThatDataUppercase: (item: string) => item.indexOf(patternIncludesId) === 0,
    removeDataUppercase: (item: string) => item.replace(patternIncludesId, ''),
  };
})();

const { patternToUppercase, checkThatPatternUppercase, removePatternUppercase } = (function () {
  const patternIncludesId = `${getRandomString(7)}_pattern_upper=`;

  return {
    patternToUppercase: (item: string) => `${patternIncludesId}${item}`,
    checkThatPatternUppercase: (item: string) => item.indexOf(patternIncludesId) === 0,
    removePatternUppercase: (item: string) => item.replace(patternIncludesId, ''),
  };
})();

/**
 * Compares two data values, data and pattern, with optional comparison options.
 *
 * @param {any} data - The data value to be compared.
 * @param {any} pattern - The pattern value to compare against.
 * @param {Object} options - Optional comparison options.
 * @param {boolean} [options.stringIncludes] - Indicates whether to check if one string includes another.
 * @param {boolean} [options.stringLowercase] - Indicates whether to convert data and pattern to lowercase before comparing.
 * @param {boolean} [options.stringUppercase] - Indicates whether to convert data and pattern to uppercase before comparing.
 * @param {boolean} [options.allowNumberTypecast] - Indicates whether to allow typecasting for number comparison.
 * @param {boolean} [options.checkEmptyStrings] - Indicates whether to check if a string is empty.
 * @param {boolean} [options.ignoreNonStringsTypes] - Indicates whether to ignore non-string data types.
 * @param {boolean} [options.checkStringLength] - Indicates whether to check the length of a string.
 * @returns {Object} An object with `comparisonMessage` and `comparisonResult` properties.
 * @property {string} comparisonMessage - A message describing the result of the comparison.
 * @property {boolean} comparisonResult - `true` if the data and pattern match according to the options, `false` otherwise.
 */
function comparePrimitives(
  data,
  pattern,
  {
    stringIncludes,
    stringLowercase,
    stringUppercase,
    allowNumberTypecast,
    checkEmptyStrings,
    ignoreNonStringsTypes,
    checkStringLength,
  }: {
    stringIncludes?: boolean;
    stringLowercase?: boolean;
    stringUppercase?: boolean;
    allowNumberTypecast?: boolean;
    checkEmptyStrings?: boolean;
    ignoreNonStringsTypes?: boolean;
    checkStringLength?: boolean;
  } = {},
): { comparisonMessage: string; comparisonResult: boolean } {
  let comparisonResult;
  let comparisonMessage;
  let messagePostfix = '';

  const areBothStrings = isString(data) && isString(pattern);
  const isDataInclude = isString(pattern) && checkThatDataIncludes(pattern);
  const isPatternInclude = isString(pattern) && checkThatPatternIncludes(pattern);

  const isPatternToUpper = isString(pattern) && checkThatPatternUppercase(pattern);
  const isPatternToLower = isString(pattern) && checkThatPatternLowercase(pattern);

  const isDataToUpper = isString(pattern) && checkThatDataUppercase(pattern);
  const isDataToLower = isString(pattern) && checkThatDataLowercase(pattern);

  if (ignoreNonStringsTypes && !isString(data)) {
    return { comparisonResult: true, comparisonMessage: '' };
  }

  if (isPatternToUpper) {
    pattern = (removePatternUppercase(pattern) as string).toUpperCase();

    messagePostfix += 'pattern is uppercased';
  }

  if (isPatternToLower) {
    pattern = (removePatternLowercase(pattern) as string).toLowerCase();

    messagePostfix += 'pattern is lowercased';
  }

  if (isDataToUpper && areBothStrings) {
    pattern = removeDataUppercase(pattern) as string;
    data = (data as string).toUpperCase();

    messagePostfix += 'data is uppercased';
  }

  if (isDataToLower && areBothStrings) {
    pattern = removeDataLowercase(pattern) as string;
    data = (data as string).toLowerCase();

    messagePostfix += 'data is lowercased';
  }

  if (isDataInclude) {
    pattern = removeDataIncludesId(pattern);
  }

  if (isPatternInclude) {
    pattern = removePatternIncludesId(pattern);
  }

  if (areBothStrings && stringLowercase) {
    data = (data as string).toLowerCase();
    pattern = (pattern as string).toLowerCase();

    messagePostfix += 'data and pattern are lowercased';
  }

  if (areBothStrings && stringUppercase) {
    data = (data as string).toUpperCase();
    pattern = (pattern as string).toUpperCase();

    messagePostfix += 'data and pattern are uppercased';
  }

  if (checkStringLength && safeHasOwnPropery(pattern, 'length') && Object.keys(pattern).length === 1) {
    comparisonResult = execNumberExpression(
      isString(pattern.length) ? pattern.length : `===${pattern.length}`,
      data.length,
    );

    comparisonMessage = `expected: string has ${pattern.length} length, actual: string has ${data.length} length`;
  } else if (checkEmptyStrings && isString(data) && (isUndefined(pattern) || isNull(pattern))) {
    comparisonResult = Boolean(data.length);

    comparisonMessage = `expected: ${data} should not be empty string `;
  } else if (isDate(data) && isDate(pattern)) {
    comparisonResult = +data === +pattern;

    comparisonMessage = `expected: ${pattern}, actual: ${data} `;
  } else if (isNumber(data) && isString(pattern) && checkThatCheckNumber(pattern)) {
    const expression = removeCheckNumberId(pattern).trim();

    comparisonResult = execNumberExpression(expression, data);

    comparisonMessage = `expected: ${data} ${expression} `;
  } else if (allowNumberTypecast && ((isNumber(data) && isString(pattern)) || (isNumber(pattern) && isString(data)))) {
    comparisonResult = data == pattern;

    comparisonMessage = `expected: ${pattern}, actual: ${data} `;
    messagePostfix += ' typecast is allowed';
  } else if (areBothStrings && isPatternInclude) {
    comparisonResult = (pattern as string).includes(data);

    comparisonMessage = `expected: pattern ${pattern} string should include data ${data} `;
  } else if (areBothStrings && isDataInclude) {
    comparisonResult = (data as string).includes(pattern);

    comparisonMessage = `expected: data ${data} string should include pattern ${pattern} `;
  } else if (areBothStrings && stringIncludes) {
    comparisonResult = data.includes(pattern);

    comparisonMessage = `expected: data ${data} string should include pattern ${pattern} `;
  } else if (isString(data) && isRegExp(pattern)) {
    comparisonResult = (pattern as RegExp).test(data);

    comparisonMessage = `expected: data ${data} string should match to regex ${pattern.toString()} `;
  } else {
    comparisonResult = data === pattern;

    comparisonMessage = `expected: ${pattern}, actual: ${data} `;
  }

  return { comparisonResult, comparisonMessage: `${comparisonMessage}${messagePostfix}` };
}

export {
  toDataIncludes,
  checkThatDataIncludes,
  removeDataIncludesId,
  toPatternIncludes,
  checkThatPatternIncludes,
  removePatternIncludesId,
  toCheckNumber,
  checkThatCheckNumber,
  removeCheckNumberId,
  dataToLowercase,
  checkThatDataLowercase,
  removeDataLowercase,
  patternToLowercase,
  checkThatPatternLowercase,
  removePatternLowercase,
  dataToUppercase,
  checkThatDataUppercase,
  removeDataUppercase,
  patternToUppercase,
  checkThatPatternUppercase,
  removePatternUppercase,
  // main comparison
  comparePrimitives,
};
