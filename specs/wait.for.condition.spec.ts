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


const check = {
	a: {
		text: 'first'
	},
	b: {
		c: {
			d: {text: 'second'}
		}
	},
	c: {
		length: 1,
		a: {
			b: {text: 'array text1'}
		}
	}
};

const result = {
	a: {
		text: 'first'
	},
	b: {
		c: {
			d: {text: 'second'}
		}
	},
	c: [{
		a: {
			b: {text: 'array text'}
		}
	}]
};
