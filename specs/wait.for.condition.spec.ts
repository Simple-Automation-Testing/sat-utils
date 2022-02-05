import {deepStrictEqual} from 'assert';
import {waitForCondition} from '../lib';

describe('SPEC', function() {
	it('[P] waitForCondition falseIfError', async function() {
		const throwFunction = () => {
			throw new Error('TEST');
		};

		const result = await waitForCondition(throwFunction, {dontThrow: true, timeout: 1500, interval: 50});

		deepStrictEqual(result, false);
	});

	it('[P] waitForCondition stopIfNoError', async function() {
		const returnFalse = async () => Promise.resolve(false);
		const result = await waitForCondition(returnFalse, {stopIfNoError: true});

		deepStrictEqual(result, false);
	});

	it.skip('[N] waitForCondition stopIfNoError', async function() {
		const returnFalse = async () => {
			throw new Error('AAAA');
		};
		const result = await waitForCondition(returnFalse, {stopIfNoError: true});

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

