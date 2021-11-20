import {isNumber} from './types';

async function sleep(millisecond: number = 5 * 1000): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, millisecond));
}

interface IWaiterOpts {
	timeout?: number;
	interval?: number;
	dontThrow?: boolean;
	falseIfError?: boolean;
	message?: string;
	throwCustom?: (currentError?) => any;
	createMessage?: (...args: any[]) => string;
	analyseResult?: (...args: any[]) => boolean | Promise<boolean>;
	waiterError?: new (...args: any[]) => any;
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
		waiterError = Error,
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

		await sleep(interval);
	}

	if (dontThrow) {
		return result;
	}

	if (throwCustom) {
		return throwCustom(errorWhichWasThrown);
	}

	if (!result) {
		const errorMessage = createMessage
			? createMessage(timeout, errorWhichWasThrown)
			: message
				? message
				: `Required condition was not achieved during ${timeout} ms`;

		throw new waiterError(errorMessage);
	}
}

waitForCondition.setDefaultOpts = function(opts: IWaiterOpts) {
	Object.keys(defaultOptions).forEach((key) => {
		delete defaultOptions[key];
	});
	Object.assign(defaultOptions, opts);
};

export {waitForCondition, sleep};
