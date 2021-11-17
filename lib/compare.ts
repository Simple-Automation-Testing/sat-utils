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

function compareToPatter(dataToCheck, pattern, options?: ICompareOpts) {
	const {separator = '->', ...opts} = options || {};
	const failIndex = null;
	let message = '';

	function compare(data, piece, opts: ICompareOpts = {}) {
		const resultData = {result: false, messagePart: ''};

		const {strictStrings = true, strictArrays = true} = opts;

		if (isPrimitive(piece) && isPrimitive(data)) {
			resultData.result = isString(piece) && isString(data) && !strictStrings ? data.includes(piece) : data === piece;

			if (!resultData.result) {
				resultData.messagePart += `Message: expected: ${piece}, actual: ${data}`;
			}

			return resultData;
		}

		if (isObject(piece) && isObject(data)) {
			resultData.result = Object.keys(piece).every((key) => {
				const compareResult = compare(data[key], piece[key], opts);

				resultData.messagePart += compareResult.messagePart;

				return compareResult.result;
			});
			return resultData;
		}

		if (isArray(data)) {
			const {length, ...pieceWithoutLength} = piece;
			if (checkLenghtIfRequired(length, data.length)) {
				resultData.messagePart = data[strictArrays ? 'every' : 'some']((dataItem, index) => {
					const compareResult = compare(dataItem, pieceWithoutLength, opts);

					resultData.messagePart += compareResult.messagePart;

					return compareResult.result;
				});
				return resultData;
			} else {
				resultData.messagePart += `Message: expected length: ${length}, actual lenght: ${data.length}`;
			}
		}

		if (getType(data) !== getType(piece)) {
			resultData.messagePart += `Message: seems like types are not comparable, expected: ${getType(piece)}, actual: ${getType(data)}`;
		}

		return result;
	}

	const result = compare(dataToCheck, pattern, opts);
	// clean up message
	message = message.split('message key:').reverse().join(separator).trim();
	if (result) message = '';
	if (isNumber(failIndex)) message = message.replace('Message:', `[${failIndex}] Message:`);
	return {result, message};
}

export {
	compareToPatter
};
