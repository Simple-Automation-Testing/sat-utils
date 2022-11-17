import { isFunction, isAsyncFunction, isBoolean, isArray, isNumber, getType, isUndefined } from './types';
import { lengthToIndexesArray } from './utils';

async function asyncRepeat(howMany: number, callBack, repeatEvenIfCallbackFails?: boolean) {
  if (!isNumber(howMany)) {
    throw new TypeError(`asyncRepeat(): first argument should be a number, current arg is ${getType(howMany)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncRepeat(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  if (!isUndefined(repeatEvenIfCallbackFails) && !isBoolean(repeatEvenIfCallbackFails)) {
    throw new TypeError(
      `asyncRepeat(): third argument should be a boolean, current arg is ${getType(repeatEvenIfCallbackFails)}`,
    );
  }

  for (const _noop of lengthToIndexesArray(howMany)) {
    if (repeatEvenIfCallbackFails) {
      try {
        await callBack();
      } catch {
        /** ignore error */
      }
    } else {
      await callBack();
    }
  }
}

async function asyncMap<T = unknown, R = unknown>(
  ctxArray: T[],
  callBack: (item: T, index: number, arr: T[]) => Promise<R>,
): Promise<R[]> {
  if (!isArray(ctxArray)) {
    throw new TypeError(`asyncMap(): first argument should be an array, current arg is ${getType(ctxArray)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncMap(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  const result = [];

  for (const [index, item] of ctxArray.entries()) {
    result.push(await Promise.resolve(callBack(item, index, ctxArray)));
  }

  return result;
}

async function asyncForEach<T = unknown>(
  ctxArray: T[],
  callBack: (item: T, index: number, arr: T[]) => Promise<void>,
): Promise<void> {
  if (!isArray(ctxArray)) {
    throw new TypeError(`asyncForEach(): first argument should be an array, current arg is ${getType(ctxArray)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncForEach(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  for (const [index, item] of ctxArray.entries()) {
    await callBack(item, index, ctxArray);
  }
}

export { asyncRepeat, asyncMap, asyncForEach };