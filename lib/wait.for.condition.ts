import {isNumber} from './types';

async function sleep(millisecond: number = 5 * 1000): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, millisecond));
}

type IWaiterOpts = {
	timeout?: number;
	interval?: number;
	message?: string;

	throwCustom?: (currentError?) => any;
	createMessage?: (...args: any[]) => string | Promise<string>;
	analyseResult?: (...args: any[]) => boolean | Promise<boolean>;
	waiterError?: new (...args: any[]) => any;
	callEveryCycle?: () => Promise<void> | any;

	dontThrow?: boolean;
	falseIfError?: boolean;
	stopIfNoError?: boolean;
}

const defaultOptions = {};

async function waitForCondition(callback, options: IWaiterOpts = {}) {
	let errorWhichWasThrown;
	const mergedOpts = {...defaultOptions, ...options};
	const {
		message,
		timeout = 5000,
		interval = 250,
		dontThrow = false,
		throwCustom,
		createMessage,
		analyseResult,
		falseIfError = true,
		stopIfNoError,
		waiterError = Error,
		callEveryCycle,
	} = mergedOpts;

	if (!isNumber(interval)) {
		throw new TypeError('interval should be a number');
	}

	if (!isNumber(timeout)) {
		throw new TypeError('timeout should be a number');
	}

	const start = Date.now();
	let result;

	while (Date.now() - start < timeout) {
		if (falseIfError) {
			try {
				result = await callback();

				if (stopIfNoError) return result;

			} catch (error) {
				errorWhichWasThrown = error;
				result = false;
			}
		} else {
			result = await callback();
		}

		if (analyseResult && await analyseResult(result)) {
			return result;
		}

		if (result) {
			return result;
		}

		if (callEveryCycle) {
			await callEveryCycle();
		}

		await sleep(interval);
	}

	if (dontThrow) {
		return result;
	}

	if (!result) {
		if (message) throw new waiterError(message);
		if (createMessage) throw new waiterError(createMessage(timeout, errorWhichWasThrown));
		if (throwCustom) return throwCustom(errorWhichWasThrown);

		throw new waiterError(`Required condition was not achieved during ${timeout} ms. ${errorWhichWasThrown ? errorWhichWasThrown : ''}`);
	}
}

waitForCondition.setDefaultOpts = function(opts: IWaiterOpts) {
	Object.keys(defaultOptions).forEach((key) => {
		delete defaultOptions[key];
	});
	Object.assign(defaultOptions, opts);
};

export {waitForCondition, sleep};
