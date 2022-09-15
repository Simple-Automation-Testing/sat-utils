/* eslint-disable sonarjs/cognitive-complexity */
import { isArray, isObject, isPrimitive, isString, isUndefined, isNumber, getType, isEmptyObject } from './types';
import { execNumberExpression, toArray, safeHasOwnPropery } from './utils';

function getErrorMessage(data, piece) {
  if (isNumber(data) && isString(piece) && piece.indexOf('_check_number=') === 0) {
    return `not equal types. expected: ${getType(piece)} ${piece}, actual: ${getType(data)} ${data}`;
  } else if (isString(data) && isString(piece) && piece.indexOf('_pattern_includes=') === 0) {
    return `pattern does not include data expected: ${piece.replace('_pattern_includes=', '')} to include ${data}`;
  } else if (isString(data) && isString(piece) && piece.indexOf('_data_includes=') === 0) {
    return `data does not include pattern expected: ${piece.replace('_data_includes=', '')} to be part of ${data}`;
  } else if (getType(data) !== getType(piece)) {
    return `data should match to pattern expected: ${piece.replace('_data_includes=', '')}, actual ${data}`;
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
  separator?: string;
  ignoreProperties?: string | string[];
};

function compareToPattern(dataToCheck, pattern, options?: TCompareOpts) {
  const {
    separator = '->',
    ignoreProperties,
    stringIncludes,
    everyArrayItem = true,
    allowEmptyArray = true,
  } = options || {};
  const propertiesWhichWillBeIgnored = toArray(ignoreProperties);
  let message = '';

  function compare(data, piece, arrayIndex?) {
    if (isPrimitive(piece) && isPrimitive(data)) {
      let compareResult;

      if (isNumber(data) && isString(piece) && piece.indexOf('_check_number=') === 0) {
        compareResult = execNumberExpression(piece.replace('_check_number=', '').trim(), data);
      } else if (isString(data) && isString(piece) && piece.indexOf('_pattern_includes=') === 0) {
        compareResult = piece.replace('_pattern_includes=', '').includes(data);
      } else if (isString(data) && isString(piece) && piece.indexOf('_data_includes=') === 0) {
        compareResult = data.includes(piece.replace('_data_includes=', ''));
      } else if (isString(data) && isString(piece) && stringIncludes) {
        compareResult = data.includes(piece);
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
}

export { compareToPattern };
