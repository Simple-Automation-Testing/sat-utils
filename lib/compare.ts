/* eslint-disable sonarjs/cognitive-complexity */
import {
  isArray,
  isObject,
  isPrimitive,
  isString,
  isUndefined,
  isNumber,
  getType,
  isEmptyObject,
  isRegExp,
} from './types';
import { execNumberExpression, toArray, safeHasOwnPropery } from './utils';
import { getRandomString } from './randomizer';

const { toDataIncludes, checkThatDataIncludes, removeDataIncludesId } = (function () {
  const checkIncludesId = `${getRandomString(7)}_check_number=`;

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

function getErrorMessage(data, piece) {
  if (isNumber(data) && isString(piece) && checkThatCheckNumber(piece)) {
    return `expected: ${removeCheckNumberId(piece).trim()}, actual: ${data}`;
  } else if (isString(data) && isString(piece) && checkThatPatternIncludes(piece)) {
    return `pattern does not include data expected: ${removePatternIncludesId(piece)} to include ${data}`;
  } else if (isString(data) && isString(piece) && checkThatDataIncludes(piece)) {
    return `data does not include pattern expected: ${removeDataIncludesId(piece)} to be part of ${data}`;
  } else if (getType(data) !== getType(piece)) {
    return `data should match to pattern expected: ${getType(piece)} ${piece}, actual: ${getType(data)} ${data}`;
  }

  return `expected: ${piece}, actual: ${data}`;
}

function checkLenghtIfRequired(expectedLength, actualLength) {
  if (isUndefined(expectedLength)) {
    return true;
  }
  const expectedLengthExpression = isNumber(expectedLength) ? `===${expectedLength}` : expectedLength;

  return execNumberExpression(expectedLengthExpression, actualLength);
}

type TCompareOpts = {
  stringIncludes?: boolean;
  everyArrayItem?: boolean;
  allowEmptyArray?: boolean;
  allowNumberTypecast?: boolean;
  separator?: string;
  ignoreProperties?: string | string[];
};

type TCompareToPattern = ((data: any, patter: any, options?: TCompareOpts) => { result: boolean; message: string }) & {
  toDataIncludes: (arg: string) => string;
  toPatternIncludes: (arg: string) => string;
  toCheckNumber: (arg: string) => string;
};

const compareToPattern: TCompareToPattern = function (dataToCheck, pattern, options?: TCompareOpts) {
  const {
    separator = '->',
    ignoreProperties,
    stringIncludes,
    allowNumberTypecast,
    everyArrayItem = true,
    allowEmptyArray = true,
  } = options || {};
  const propertiesWhichWillBeIgnored = toArray(ignoreProperties);
  let message = '';

  function compare(data, piece, arrayIndex?) {
    if (isPrimitive(piece) && isPrimitive(data)) {
      let compareResult;

      if (allowNumberTypecast && ((isNumber(data) && isString(piece)) || (isNumber(piece) && isString(data)))) {
        compareResult = data == piece;
      } else if (isNumber(data) && isString(piece) && checkThatCheckNumber(piece)) {
        compareResult = execNumberExpression(removeCheckNumberId(piece).trim(), data);
      } else if (isString(data) && isString(piece) && checkThatPatternIncludes(piece)) {
        compareResult = removePatternIncludesId(piece).includes(data);
      } else if (isString(data) && isString(piece) && checkThatDataIncludes(piece)) {
        compareResult = data.includes(removeDataIncludesId(piece));
      } else if (isString(data) && isString(piece) && stringIncludes) {
        compareResult = data.includes(piece);
      } else if (isString(data) && isRegExp(piece)) {
        compareResult = (piece as RegExp).test(data);
      } else {
        compareResult = data === piece;
      }

      if (!compareResult) {
        const indexMessage = isNumber(arrayIndex) ? `[${arrayIndex}]` : '';

        message += `${indexMessage}Message: ${getErrorMessage(data, piece)}`;
      }

      return compareResult;
    }

    if (propertiesWhichWillBeIgnored.length && isObject(piece)) {
      piece = Object.keys(piece)
        .filter(key => !propertiesWhichWillBeIgnored.includes(key))
        .reduce((requiredKeys, key) => {
          requiredKeys[key] = piece[key];

          return requiredKeys;
        }, {});
    }

    if (isObject(piece) && isObject(data)) {
      return Object.keys(piece).every(key => {
        const compareResult = compare(data[key], piece[key]);
        if (!compareResult) {
          const indexMessage = isNumber(arrayIndex) ? `${key}[${arrayIndex}]` : `${key}`;

          message += ` message key: ${indexMessage}`;
        }

        return compareResult;
      });
    }

    if (isArray(data) && isArray(piece)) {
      return (
        checkLenghtIfRequired(piece.length, data.length) &&
        data.every((dataItem, index) => compare(dataItem, piece[index], index))
      );
    }

    if (isArray(data) && isObject(piece)) {
      const { length, ignoreIndexes, toCompare, ...checkDataPiece } = piece;
      const lengthToCheck = safeHasOwnPropery(piece, 'length') ? length : !allowEmptyArray ? '>0' : undefined;

      if (
        isEmptyObject(checkDataPiece) &&
        checkLenghtIfRequired(lengthToCheck, data.length) &&
        !safeHasOwnPropery(piece, 'toCompare')
      ) {
        return true;
      }

      if (checkLenghtIfRequired(lengthToCheck, data.length)) {
        return data
          .filter((_item, index) => {
            if (isNumber(ignoreIndexes) || isArray(ignoreIndexes)) {
              const ignore = toArray(ignoreIndexes);
              return !ignore.includes(index);
            }
            return true;
          })
          [everyArrayItem ? 'every' : 'some']((dataItem, index) => {
            if (isPrimitive(toCompare) && safeHasOwnPropery(piece, 'toCompare')) {
              return compare(dataItem, toCompare, index);
            } else if (isArray(toCompare)) {
              return compare(dataItem, toCompare[index], index);
            }
            return compare(dataItem, checkDataPiece, index);
          });
      } else {
        message += `Message: expected length: ${lengthToCheck}, actual lenght: ${data.length}`;
        return false;
      }
    }

    if (getType(data) !== getType(piece)) {
      message += `Message: seems like types are not comparable, expected: ${getType(piece)}, actual: ${getType(data)}`;
    }

    return false;
  }

  const result = compare(dataToCheck, pattern);

  if (result) {
    message = '';
    // clean up message
  } else {
    const indexPattern = /(\[\d])/;
    message = message
      .split(' message key: ')
      .reverse()
      .reduce((acc, item, index, arr) => {
        if (index === 0) {
          acc += `${item}${separator}`;
        } else if (indexPattern.test(item)) {
          const prevIndex = item.match(indexPattern)[0];
          const key = item.replace(indexPattern, '');
          const isSeparator = arr.length - 1 === index ? '' : separator;
          acc = acc.replace(new RegExp(`(${separator})$`), `${prevIndex}${separator}${key}${isSeparator}`);
        } else if (arr.length - 1 === index) {
          acc += `${item}`;
        } else {
          acc += `${item}${separator}`;
        }

        return acc;
      }, '')
      .trim();
  }

  return { result, message };
} as any;

compareToPattern.toCheckNumber = toCheckNumber;
compareToPattern.toDataIncludes = toDataIncludes;
compareToPattern.toPatternIncludes = toPatternIncludes;

export { compareToPattern };
