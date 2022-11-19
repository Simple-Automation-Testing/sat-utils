/* eslint-disable sonarjs/cognitive-complexity */
import { isObject, getType, isNumber, isString, isFunction, isAsyncFunction } from './types';

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
  waiterError?: new (...args: any[]) => any;
  analyseResult?: (...args: any[]) => boolean | Promise<boolean>;
  before?: () => Promise<void> | any;
  after?: () => Promise<void> | any;
  callEveryCycle?: () => Promise<void> | any;
};

const defaultOptions = {};

/**
 * @example
 * const {waitForCondition} = require('sat-utils');
 *
 * waitResult();
 * async function waitResult() {
 *  await waitForCondition(async () => new Promise(res => setTimeout(res, 2500)), {
 *    timeout: 5000,
 *    interval: 500
 *  })
 * }
 *
 * @param {Function} callback
 * @param {!Object} options execution options
 * @param {number} [options.timeout] execution time
 * @param {number} [options.interval] call interval
 * @param {boolean} [options.dontThrow] if during waiting cylce result was not achived - last call back execution result will be returned as a waiting cycle result
 * @param {boolean} [options.falseIfError] if call back throws an error - counted as negative result
 * @param {boolean} [options.stopIfNoError] if callback did not throw error - counted as successful result
 * @param {Error|new (...args: any[]) => any} [options.waiterError] error which will be thrown if result will not achieved
 * @param {Function} [options.analyseResult] custom analyser of the call back result
 * @param {Function} [options.before] call before waiting cycle
 * @param {Function} [options.after] call after waiting cycle, even if result was not achived, if result achived - also will be executed
 * @param {Function} [options.callEveryCycle] call every time after main call back execution if result was not achived
 * @returns {any} any result that call back will return
 */
async function waitForCondition(callback, options: IWaiterOpts = {}) {
  if (!isObject(options)) {
    throw new TypeError(`waitForCondition(): second argument should be an object, current arg is ${getType(options)}`);
  }

  let callbackError;
  const mergedOpts = { ...defaultOptions, ...options };
  const {
    message,
    timeout = 5000,
    interval = 250,
    dontThrow = false,
    analyseResult,
    falseIfError = true,
    stopIfNoError,
    waiterError = Error,
    callEveryCycle = () => {},
    before = () => {},
    after = () => {},
  } = mergedOpts;

  if (!isFunction(callback) && !isAsyncFunction(callback)) {
    throw new TypeError(
      `waitForCondition(): first argument should be a function, async function or arrow function current arg is ${getType(
        callback,
      )}`,
    );
  }

  if (!isNumber(interval)) {
    throw new TypeError(
      `waitForCondition(): second argument property "interval" should be a number, current arg is ${getType(interval)}`,
    );
  }

  if (!isNumber(interval)) {
    throw new TypeError(
      `waitForCondition(): second argument property "interval" should be a number, current arg is ${getType(interval)}`,
    );
  }

  if (!isNumber(timeout)) {
    throw new TypeError(
      `waitForCondition(): second argument property "timeout" should be a number, current arg is ${getType(timeout)}`,
    );
  }

  if (!isFunction(before) && !isAsyncFunction(before)) {
    throw new TypeError(
      `waitForCondition(): second argument property "before" should be a function, async function or arrow function, current arg is ${getType(
        before,
      )}`,
    );
  }

  if (!isFunction(after) && !isAsyncFunction(after)) {
    throw new TypeError(
      `waitForCondition(): second argument property "after" should be a function, async function or arrow function, current arg is ${getType(
        before,
      )}`,
    );
  }

  if (!isFunction(callEveryCycle) && !isAsyncFunction(callEveryCycle)) {
    throw new TypeError(
      `waitForCondition(): second argument property "callEveryCycle" should be a function, async function or arrow function, current arg is ${getType(
        callEveryCycle,
      )}`,
    );
  }

  if (analyseResult && !isFunction(analyseResult) && !isAsyncFunction(analyseResult)) {
    throw new TypeError(
      `waitForCondition(): second argument property "analyseResult" should be a function, async function or arrow function, current arg is ${getType(
        analyseResult,
      )}`,
    );
  }

  const start = Date.now();
  let result;

  await before();

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
      await after();
      return result;
    }

    if (result) {
      await after();

      return result;
    }

    await callEveryCycle();

    await sleep(interval);
  }

  await after();

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
