async function sleep(millisecond: number = 5 * 1000): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, millisecond));
}

interface IWaiterOpts {
	timeout: number;
	interval: number;
	dontThrow?: boolean;
	message?: string;
	throwCustom?: () => any;
	createMessage?: (...args: any[]) => string;
	analyseResult?: (...args: any[]) => boolean | Promise<boolean>;
}

async function waitForCondition(callback, options: IWaiterOpts = {timeout: 3000, interval: 1000}) {
	const {
		message,
		timeout,
		interval,
		dontThrow = false,
		throwCustom,
		createMessage,
		analyseResult,
	} = options;

	const start = Date.now();
	let result;

	while (Date.now() - start < timeout) {

		result = await callback();

		if (analyseResult) {
			if (await analyseResult(result)) {
				return result;
			}
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
		return throwCustom();
	}

	if (!result) {
		const errorMessage = createMessage
			? createMessage(timeout)
			: message
				? message
				: `Required condition was not achieved during ${timeout} ms`;

		throw new Error(errorMessage);
	}
}

export {waitForCondition, sleep};
