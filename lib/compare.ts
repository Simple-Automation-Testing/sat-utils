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
	const {separator = '->', ignoreProperties, ...opts} = options || {};
	const propertiesWhichWillBeIgnored = toArray(ignoreProperties);
	let message = '';

	function compare(data, piece, opts: ICompareOpts = {}, arrayIndex?) {
		const {strictStrings = true, strictArrays = true} = opts;

		if (isPrimitive(piece) && isPrimitive(data)) {
			const compareResult = isString(piece) && isString(data) && !strictStrings ? data.includes(piece) : data === piece;

			if (!compareResult) {
				message += `Message: expected: ${piece}, actual: ${data}`;
			}

			return compareResult;
		}

		if (isObject(piece) && isObject(data)) {
			return Object.keys(piece)
				.filter((key) => {
					if (propertiesWhichWillBeIgnored.length === 0) return true;
					else return !propertiesWhichWillBeIgnored.includes(key);
				})
				.every((key) => {
					const compareResult = compare(data[key], piece[key], opts);
					if (!compareResult) {
						message += `message key:${isNumber(arrayIndex) ? `${key}[${arrayIndex}]` : `${key}`}`;
					}

					return compareResult;
				});
		}

		if (isArray(data) && isArray(piece)) {
			if (checkLenghtIfRequired(piece.length, data.length)) {
				return data.every((dataItem, index) => compare(dataItem, piece[index], opts, index));
			} else {
				return false;
			}
		}

		if (isArray(data)) {
			const {length, ignoreIndexes, ...pieceWithoutLength} = piece;
			const {toCompare, ...pieceWithoutPrimitives} = pieceWithoutLength;


			if (
				isEmptyObject(pieceWithoutPrimitives)
				&& checkLenghtIfRequired(length, data.length)
				&& !('toCompare' in pieceWithoutLength)
			) {
				return true;
			}

			if (checkLenghtIfRequired(length, data.length)) {
				return data.filter((_item, index) => {
					if (ignoreIndexes && (isNumber(ignoreIndexes) || isArray(ignoreIndexes))) {
						const ignore = toArray(ignoreIndexes);
						return !ignore.includes(index);
					}
					return true;
				})[strictArrays ? 'every' : 'some']((dataItem, index, arr) => {
					if (isPrimitive(toCompare) && ('toCompare' in pieceWithoutLength)) {
						return compare(dataItem, toCompare, opts, index);
					} else if (isArray(toCompare)) {
						return compare(dataItem, toCompare[index], opts, index);
					}
					return compare(dataItem, pieceWithoutLength, opts, index);
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

	const result = compare(dataToCheck, pattern, opts);
	// clean up message
	message = message.split('message key:').reverse().join(separator).trim();
	if (result) message = '';
	return {result, message};
}

export {
	compareToPattern
};
