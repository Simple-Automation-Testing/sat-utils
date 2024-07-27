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
  isFunction,
  isRegExp,
} from './types';
import { execNumberExpression, toArray, safeHasOwnPropery } from './utils';
import {
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
  // own check function
  customCheck?: boolean;
  // strings
  stringIncludes?: boolean;
  stringLowercase?: boolean;
  stringUppercase?: boolean;
  checkEmptyStrings?: boolean;
  checkStringLength?: boolean;

  ignoreNonStringsTypes?: boolean;
  // objects
  dataIncldesPatternPart?: boolean;
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
  checkThatDataIncludes: (arg: string | any) => boolean;
  removeDataIncludesId: (arg: string) => string;
  toPatternIncludes: (arg: string) => string;
  checkThatPatternIncludes: (arg: string | any) => boolean;
  removePatternIncludesId: (arg: string) => string;
  toCheckNumber: (arg: string) => string;
  checkThatCheckNumber: (arg: string | any) => boolean;
  removeCheckNumberId: (arg: string) => string;
  dataToLowercase: (arg: string) => string;
  checkThatDataLowercase: (arg: string | any) => boolean;
  removeDataLowercase: (arg: string) => string;
  patternToLowercase: (arg: string) => string;
  checkThatPatternLowercase: (arg: string | any) => boolean;
  removePatternLowercase: (arg: string) => string;
  dataToUppercase: (arg: string) => string;
  checkThatDataUppercase: (arg: string | any) => boolean;
  removeDataUppercase: (arg: string) => string;
  patternToUppercase: (arg: string) => string;
  checkThatPatternUppercase: (arg: string | any) => boolean;
  removePatternUppercase: (arg: string) => string;
};

const compareToPattern: TCompareToPattern = function (dataToCheck, pattern, options?: TCompareOpts) {
  const {
    separator = '->',
    ignoreProperties,

    everyArrayItem = true,
    allowEmptyArray = true,
    patternIncludesMembers,
    customCheck,
    dataIncludesMembers,
    checkEmptyStrings,
    checkStringLength,
    dataIncldesPatternPart = false,

    ...primitivesOpts
  } = options || {};
  const propertiesWhichWillBeIgnored = toArray(ignoreProperties);
  let message = '';

  function compare(data, piece?, arrayIndex?) {
    if (message.length > 0 && !message.endsWith(' ')) {
      message += ' ';
    }

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

    if (isFunction(piece) && customCheck) {
      const customCheckResult = piece(data);

      if (!customCheckResult) {
        message += `Message: expected that custom check result should be true`;
      }

      return customCheckResult;
    }

    if (
      isPrimitive(data) &&
      (isPrimitive(piece) ||
        isRegExp(piece) ||
        (checkStringLength && safeHasOwnPropery(piece, 'length') && Object.keys(piece).length === 1))
    ) {
      const { comparisonMessage, comparisonResult } = comparePrimitives(data, piece, {
        checkEmptyStrings,
        checkStringLength,
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
      const call = dataIncldesPatternPart ? 'some' : 'every';

      return Object.keys(piece)[call](key => {
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
      const lengthToCheck = safeHasOwnPropery(piece, 'length') ? length : allowEmptyArray ? undefined : '>0';

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

        return everyArrayItem ? result.length === dataWithoutIndexesThatShouldBeIgnored.length : Boolean(result.length);
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
    // TODO message formatting should be improved
    const indexPattern = /(\[\d])/;

    function createMessage(notFormattedMessage) {
      return notFormattedMessage
        .replaceAll(/  /gi, ' ')
        .split(' message key: ')
        .reverse()
        .reduce((acc, item, index, arr) => {
          if (index === 0 && arr.length - 1 !== index) {
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

    message =
      message.split(' message key: ').length > 2 &&
      message
        .split('Message:')
        .map(m => m.trim())
        .filter(m => !indexPattern.test(m))
        .filter(Boolean).length > 1
        ? message
            .split('Message:')
            .map(m => m.trim())
            .filter(Boolean)
            .map(m => createMessage(`Message: ${m}`))
            .join('\n')
        : createMessage(message);
  }

  return { result, message };
} as TCompareToPattern;

compareToPattern.toDataIncludes = toDataIncludes;
compareToPattern.checkThatDataIncludes = checkThatDataIncludes;
compareToPattern.removeDataIncludesId = removeDataIncludesId;
compareToPattern.toPatternIncludes = toPatternIncludes;
compareToPattern.checkThatPatternIncludes = checkThatPatternIncludes;
compareToPattern.removePatternIncludesId = removePatternIncludesId;
compareToPattern.toCheckNumber = toCheckNumber;
compareToPattern.checkThatCheckNumber = checkThatCheckNumber;
compareToPattern.removeCheckNumberId = removeCheckNumberId;
compareToPattern.dataToLowercase = dataToLowercase;
compareToPattern.checkThatDataLowercase = checkThatDataLowercase;
compareToPattern.removeDataLowercase = removeDataLowercase;
compareToPattern.patternToLowercase = patternToLowercase;
compareToPattern.checkThatPatternLowercase = checkThatPatternLowercase;
compareToPattern.removePatternLowercase = removePatternLowercase;
compareToPattern.dataToUppercase = dataToUppercase;
compareToPattern.checkThatDataUppercase = checkThatDataUppercase;
compareToPattern.removeDataUppercase = removeDataUppercase;
compareToPattern.patternToUppercase = patternToUppercase;
compareToPattern.checkThatPatternUppercase = checkThatPatternUppercase;
compareToPattern.removePatternUppercase = removePatternUppercase;

export { compareToPattern };
