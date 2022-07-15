/* eslint-disable sonarjs/cognitive-complexity */
import { isNumber, isString, isFunction, isAsyncFunction } from './types';

async function sleep(millisecond: number = 5 * 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millisecond));
}

type IWaiterOpts = {
  timeout?: number;
  interval?: number;
  dontThrow?: boolean;
  falseIfError?: boolean;
  stopIfNoError?: boolean;

  message?: string | ((timeout: number, callbackError?: any) => Promise<string> | string);
  throwCustom?: (timeout: number, callbackError?: any) => any;
  analyseResult?: (...args: any[]) => boolean | Promise<boolean>;
  waiterError?: new (...args: any[]) => any;
  callEveryCycle?: () => Promise<void> | any;
};

const defaultOptions = {};

async function waitForCondition(callback, options: IWaiterOpts = {}) {
  let callbackError;
  const mergedOpts = { ...defaultOptions, ...options };
  const {
    message,
    timeout = 5000,
    interval = 250,
    dontThrow = false,
    throwCustom,
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
        callbackError = error;
        result = false;
      }
    } else {
      result = await callback();
    }

    if (analyseResult && (await analyseResult(result))) {
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
    const callbackErrorMessagePart = callbackError ? callbackError : '';
    let errorMessage = `Required condition was not achieved during ${timeout} ms. ${callbackErrorMessagePart}`;

    if (isString(message)) {
      errorMessage = message as string;
    } else if (isFunction(message) || isAsyncFunction(message)) {
      errorMessage = await (message as (timeout: number, callbackError?: any) => Promise<string> | string)(
        timeout,
        callbackError,
      );
    }
    if (throwCustom) return throwCustom(timeout, callbackError);

    throw new waiterError(errorMessage);
  }
}

waitForCondition.setDefaultOpts = function (opts: IWaiterOpts) {
  Object.keys(defaultOptions).forEach(key => {
    delete defaultOptions[key];
  });
  Object.assign(defaultOptions, opts);
};

export { waitForCondition, sleep };
