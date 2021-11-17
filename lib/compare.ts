import {isArray, isObject, isPrimitive, isString, isUndefined, isNumber, getType} from './types';
import {execNumberExpression} from './utils';

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
}

function compareToPattern(dataToCheck, pattern, options?: ICompareOpts) {
	const {separator = '->', ...opts} = options || {};
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
			return Object.keys(piece).every((key) => {
				const compareResult = compare(data[key], piece[key], opts);
				if (!compareResult) {
					message += `message key:${isNumber(arrayIndex) ? `[${arrayIndex}]${key}` : `${key}`}`;
				}

				return compareResult;
			});
		}

		if (isArray(data)) {
			const {length, ...pieceWithoutLength} = piece;
			if (checkLenghtIfRequired(length, data.length)) {
				return data[strictArrays ? 'every' : 'some']((dataItem, index) => {
					const compareResult = compare(dataItem, pieceWithoutLength, opts, index);
					return compareResult;
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
