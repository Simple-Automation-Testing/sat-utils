import {isArray, isObject, isPrimitive, isString, isUndefined, isNumber, getType, isEmptyObject} from './types';
import {execNumberExpression, toArray} from './utils';

function checkLenghtIfRequired(expectedLength, actualLength) {
	if (isUndefined(expectedLength)) {
		return true;
	}
	const expectedLengthExpression = isNumber(expectedLength) ? `===${expectedLength}` : expectedLength;

	return execNumberExpression(expectedLengthExpression, actualLength);
}


interface ICompareOpts {
	strictStrings?: boolean;
	strictArrays?: boolean;
	separator?: string;
	ignoreProperties?: string | string[];
}

function compareToPattern(dataToCheck, pattern, options?: ICompareOpts) {
	const {separator = '->', ignoreProperties, strictStrings = true, strictArrays = true} = options || {};
	const propertiesWhichWillBeIgnored = toArray(ignoreProperties);
	let message = '';

	function compare(data, piece, arrayIndex?) {

		if (isPrimitive(piece) && isPrimitive(data)) {
			const compareResult = isString(piece) && isString(data) && !strictStrings ? data.includes(piece) : data === piece;

			if (!compareResult) {
				const indexMessage = isNumber(arrayIndex) ? `>>[${arrayIndex}] ` : '';
				message += `${indexMessage}Message: expected: ${piece}, actual: ${data}`;
			}

			return compareResult;
		}

		if (propertiesWhichWillBeIgnored.length && isObject(piece)) {
			piece = Object.keys(piece)
				.filter((key) => !propertiesWhichWillBeIgnored.includes(key))
				.reduce((requiredKeys, key) => {
					requiredKeys[key] = piece[key];

					return requiredKeys;
				}, {});
		}

		if (isObject(piece) && isObject(data)) {
			return Object.keys(piece)
				.every((key) => {
					const compareResult = compare(data[key], piece[key]);
					if (!compareResult) {
						message += `message key:${isNumber(arrayIndex) ? `${key}[${arrayIndex}]` : `${key}`}`;
					}

					return compareResult;
				});
		}

		if (isArray(data) && isArray(piece)) {
			if (checkLenghtIfRequired(piece.length, data.length)) {
				return data.every((dataItem, index) => compare(dataItem, piece[index], index));
			} else {
				return false;
			}
		}

		if (isArray(data)) {
			const {length, ignoreIndexes, ...pieceWithoutLength} = piece;
			const {toCompare, ...pieceWithoutPrimitives} = pieceWithoutLength;


			if (isEmptyObject(pieceWithoutPrimitives) && checkLenghtIfRequired(length, data.length) && !('toCompare' in pieceWithoutLength)) {
				return true;
			}

			if (checkLenghtIfRequired(length, data.length)) {
				return data.filter((_item, index) => {
					if (ignoreIndexes && (isNumber(ignoreIndexes) || isArray(ignoreIndexes))) {
						const ignore = toArray(ignoreIndexes);
						return !ignore.includes(index);
					}
					return true;
				})[strictArrays ? 'every' : 'some']((dataItem, index) => {
					if (isPrimitive(toCompare) && ('toCompare' in pieceWithoutLength)) {
						return compare(dataItem, toCompare, index);
					} else if (isArray(toCompare)) {
						return compare(dataItem, toCompare[index], index);
					}
					return compare(dataItem, pieceWithoutLength, index);
				});
			} else {
				message += `Message: expected length: ${length}, actual lenght: ${data.length}`;
				return false;
			}
		}

		if (getType(data) !== getType(piece)) {
			message += `Message: seems like types are not comparable, expected: ${getType(piece)}, actual: ${getType(data)}`;
		}

		return false;
	}

	const result = compare(dataToCheck, pattern);
	// clean up message
	message = message.split('message key:')
		.reverse()
		.join(separator)
		.trim()
		.replace(new RegExp(`${separator}>>`, 'ig'), '')
		.replace(new RegExp(` Message:`, 'ig'), `${separator}Message:`);
	if (result) message = '';
	return {result, message};
}

export {
	compareToPattern
};
