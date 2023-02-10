/* eslint-disable sonarjs/cognitive-complexity */
import {
  isNull,
  isArray,
  isObject,
  isPrimitive,
  isUndefined,
  isNumber,
  getType,
  isEmptyObject,
  isNotEmptyObject,
  isRegExp,
} from './types';
import { execNumberExpression, toArray, safeHasOwnPropery } from './utils';
import {
  toCheckNumber,
  toDataIncludes,
  toPatternIncludes,
  dataToUppercase,
  dataToLowercase,
  patternToLowercase,
  patternToUppercase,
  comparePrimitives,
} from './compare/result.handlers';

function checkLengthIfRequired(expectedLength, actualLength) {
  if (isUndefined(expectedLength)) {
    return true;
  }
  const expectedLengthExpression = isNumber(expectedLength) ? `===${expectedLength}` : expectedLength;

  return execNumberExpression(expectedLengthExpression, actualLength);
}

export type TCompareOpts = {
  // strings
  stringIncludes?: boolean;
  stringLowercase?: boolean;
  stringUppercase?: boolean;
  checkEmptyStrings?: boolean;
  ignoreNonStringsTypes?: boolean;
  // arrays
  dataIncludesMembers?: boolean;
  patternIncludesMembers?: boolean;
  everyArrayItem?: boolean;
  allowEmptyArray?: boolean;
  // typecast
  allowNumberTypecast?: boolean;
  // separator
  separator?: string;
  // to ignore
  ignoreProperties?: string | string[];
};

type TCompareToPattern = ((data: any, patter: any, options?: TCompareOpts) => { result: boolean; message: string }) & {
  toDataIncludes: (arg: string) => string;
  toPatternIncludes: (arg: string) => string;
  toCheckNumber: (arg: string) => string;
  dataToUppercase: (arg: string) => string;
  dataToLowercase: (arg: string) => string;
  patternToLowercase: (arg: string) => string;
  patternToUppercase: (arg: string) => string;
};

const compareToPattern: TCompareToPattern = function (dataToCheck, pattern, options?: TCompareOpts) {
  const {
    separator = '->',
    ignoreProperties,

    everyArrayItem = true,
    allowEmptyArray = true,
    patternIncludesMembers,
    dataIncludesMembers,
    checkEmptyStrings,

    ...primitivesOpts
  } = options || {};
  const propertiesWhichWillBeIgnored = toArray(ignoreProperties);
  let message = '';

  function compare(data, piece?, arrayIndex?) {
    function compareArrays(dataArray, patternArray) {
      if (
        !dataIncludesMembers &&
        !patternIncludesMembers &&
        !checkLengthIfRequired(patternArray.length, dataArray.length)
      ) {
        message += `Message: expected length: ${patternArray.length}, actual lenght: ${dataArray.length}`;
        return false;
      }

      if (dataIncludesMembers && dataArray.lenght < patternArray.lenght) {
        message += `Message: data can not include all pattern member because of expected length: ${patternArray.length}, actual lenght: ${dataArray.length}`;
        return false;
      }

      if (patternIncludesMembers && dataArray.lenght > patternArray.lenght) {
        message += `Message: pattern can not include all pattern member because of expected length: ${patternArray.length}, actual lenght: ${dataArray.length}`;
        return false;
      }

      if (dataIncludesMembers) {
        const result = patternArray.every(patternArrayItem =>
          dataArray.some(dataArrayItem => compare(dataArrayItem, patternArrayItem)),
        );

        if (!result) {
          message += 'Message: data does not include all pattern members';
        }

        return result;
      }

      if (patternIncludesMembers) {
        const result = dataArray.every(dataArrayItem =>
          patternArray.some(patternArrayItem => compare(dataArrayItem, patternArrayItem)),
        );

        if (!result) {
          message += 'Message: pattern does not include all data members';
        }

        return result;
      }

      return dataArray.every((dataArrayItem, index) => compare(dataArrayItem, patternArray[index], index));
    }

    if (isPrimitive(data) && (isPrimitive(piece) || isRegExp(piece))) {
      const { comparisonMessage, comparisonResult } = comparePrimitives(data, piece, {
        checkEmptyStrings,
        ...primitivesOpts,
      });

      if (!comparisonResult) {
        const indexMessage = isNumber(arrayIndex) ? `[${arrayIndex}]` : '';

        message += `${indexMessage}Message: ${comparisonMessage}`;
      }

      return comparisonResult;
    }

    if (propertiesWhichWillBeIgnored.length && isObject(piece)) {
      piece = Object.keys(piece)
        .filter(key => !propertiesWhichWillBeIgnored.includes(key))
        .reduce((requiredKeys, key) => {
          requiredKeys[key] = piece[key];

          return requiredKeys;
        }, {});
    }

    if ((isEmptyObject(piece) || isUndefined(piece) || isNull(piece)) && checkEmptyStrings && isObject(data)) {
      return Object.keys(data).every(key => {
        const compareResult = compare(data[key]);
        if (!compareResult) {
          const indexMessage = isNumber(arrayIndex) ? `${key}[${arrayIndex}]` : `${key}`;

          message += ` message key: ${indexMessage}`;
        }

        return compareResult;
      });
    }

    if ((isEmptyObject(piece) || isUndefined(piece) || isNull(piece)) && checkEmptyStrings && isArray(data)) {
      return data.every((dataItem, index) => {
        return compare(dataItem, undefined, index);
      });
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
      return compareArrays(data, piece);
    }

    if (isArray(data) && isObject(piece)) {
      const { length, toCount, ignoreIndexes, toCompare, ...checkDataPiece } = piece;
      const lengthToCheck = safeHasOwnPropery(piece, 'length') ? length : !allowEmptyArray ? '>0' : undefined;

      if (
        isEmptyObject(checkDataPiece) &&
        checkLengthIfRequired(lengthToCheck, data.length) &&
        !safeHasOwnPropery(piece, 'toCompare')
      ) {
        return true;
      }

      if (checkLengthIfRequired(lengthToCheck, data.length)) {
        const dataWithoutIndexesThatShouldBeIgnored = data.filter((_dataItem, index) => {
          if (isNumber(ignoreIndexes) || isArray(ignoreIndexes)) {
            const ignore = toArray(ignoreIndexes);
            return !ignore.includes(index);
          }
          return true;
        });

        if (isArray(toCompare)) {
          return compareArrays(dataWithoutIndexesThatShouldBeIgnored, toCompare);
        }

        const result = dataWithoutIndexesThatShouldBeIgnored.filter((dataItem, index) => {
          if (isPrimitive(toCompare) && safeHasOwnPropery(piece, 'toCompare')) {
            return compare(dataItem, toCompare, index);
          }
          return compare(dataItem, checkDataPiece, index);
        });

        if (isNumber(toCount)) {
          return toCount === result.length;
        }

        return everyArrayItem ? result.length === dataWithoutIndexesThatShouldBeIgnored.length : result.length;
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
} as TCompareToPattern;

compareToPattern.toCheckNumber = toCheckNumber;
compareToPattern.toDataIncludes = toDataIncludes;
compareToPattern.toPatternIncludes = toPatternIncludes;
compareToPattern.dataToUppercase = dataToUppercase;
compareToPattern.dataToLowercase = dataToLowercase;
compareToPattern.patternToLowercase = patternToLowercase;
compareToPattern.patternToUppercase = patternToUppercase;

export { compareToPattern };
