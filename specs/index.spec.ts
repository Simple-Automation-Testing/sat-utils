import {deepStrictEqual} from 'assert';
import {getRandomString, execNumberExpression, waitForCondition} from '../lib';

describe('SPEC', function() {
	it('[P] getRandomString', function() {
		const firstRes = getRandomString(1);
		deepStrictEqual(firstRes.length, 1, 'Should be one letter in random string');

		const secondRes = getRandomString(1, {numbers: true});
		deepStrictEqual(typeof Number(secondRes) === 'number', true, 'Should be a number');
		// @ts-ignore
		deepStrictEqual(secondRes == Number(secondRes), true, 'Should be equal');
	});

	it('[N] getRandomString', function() {
		try {
			getRandomString('rr');
		} catch (error) {
			deepStrictEqual(
				error.toString().includes('getRandomString(): first argument should be a number, current arg is string'),
				true,
				'Error shold have clear message about first argument'
			);
		}

		try {
			getRandomString(10, {});
		} catch (error) {
			deepStrictEqual(
				error.toString().includes('Error: getRandomString(): second argument should be an object with next opts'),
				true,
				'Error shold have clear message about second argument'
			);
		}
	});

	it('[P] execNumberExpression', function() {
		deepStrictEqual(execNumberExpression('>10 and <15', 11), true, '11 shoult be in range from 10 to 15');
		deepStrictEqual(execNumberExpression('>10 and <9', 11), false, '11 shoult be in range from 10 to 9');
	});

	it('[P] waitForCondition falseIfError', async function() {
		const throwFunction = () => {
			throw new Error('TEST');
		};

		const result = await waitForCondition(throwFunction, {dontThrow: true, timeout: 1500, interval: 50});

		deepStrictEqual(result, false);
	});

	it('[N] waitForCondition falseIfError', async function() {
		const throwError = new Error('TEST');
		const throwFunction = () => {
			throw throwError;
		};

		try {
			await waitForCondition(throwFunction, {falseIfError: false, timeout: 1500, interval: 50});
		} catch (error) {
			deepStrictEqual(throwError, error);
		}
	});
});
