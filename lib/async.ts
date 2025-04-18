import { isFunction, isAsyncFunction, isBoolean, isArray, isNumber, getType, isUndefined } from './types';
import { lengthToIndexesArray } from './utils';

async function asyncRepeat(
  howMany: number,
  callBack: (index: number) => Promise<any> | any,
  repeatEvenIfCallbackFails?: boolean,
) {
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

  for (const iterationNumber of lengthToIndexesArray(howMany)) {
    if (repeatEvenIfCallbackFails) {
      try {
        await callBack(iterationNumber);
      } catch {
        /** ignore error */
      }
    } else {
      await callBack(iterationNumber);
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

async function asyncFilter<T = unknown>(
  ctxArray: T[],
  callBack: (item: T, index: number, arr: T[]) => Promise<boolean>,
): Promise<T[]> {
  if (!isArray(ctxArray)) {
    throw new TypeError(`asyncFilter(): first argument should be an array, current arg is ${getType(ctxArray)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncFilter(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  const result = [];

  for (const [index, item] of ctxArray.entries()) {
    const res = await Promise.resolve(callBack(item, index, ctxArray)).catch(() => false);
    if (res) result.push(item);
  }

  return result;
}

async function asyncEvery<T = unknown>(
  ctxArray: T[],
  callBack: (item: T, index: number, arr: T[]) => Promise<boolean>,
): Promise<boolean> {
  if (!isArray(ctxArray)) {
    throw new TypeError(`asyncEvery(): first argument should be an array, current arg is ${getType(ctxArray)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncEvery(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  for (const [index, item] of ctxArray.entries()) {
    const res = await Promise.resolve(callBack(item, index, ctxArray)).catch(() => false);
    if (!res) return false;
  }

  return true;
}

async function asyncSome<T = unknown>(
  ctxArray: T[],
  callBack: (item: T, index: number, arr: T[]) => Promise<boolean>,
): Promise<boolean> {
  if (!isArray(ctxArray)) {
    throw new TypeError(`asyncSome(): first argument should be an array, current arg is ${getType(ctxArray)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncSome(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  for (const [index, item] of ctxArray.entries()) {
    const res = await Promise.resolve(callBack(item, index, ctxArray)).catch(() => false);
    if (res) return true;
  }

  return false;
}

async function asyncReduce<T = unknown, R = unknown>(
  ctxArray: T[],
  callBack: (accum: R, item: T, index: number, arr: T[]) => Promise<R | unknown>,
  ...rest: unknown[] | R[]
): Promise<R | unknown> {
  if (!isArray(ctxArray)) {
    throw new TypeError(`asyncMap(): first argument should be an array, current arg is ${getType(ctxArray)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncMap(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  const [_first, ...restCtxArr] = ctxArray;

  let accumHolder: unknown = rest.length === 1 ? rest[0] : ctxArray[0];
  const executionArr = rest.length === 1 ? ctxArray : restCtxArr;
  const indexShift = rest.length === 1 ? 0 : 1;

  for (const [index, item] of executionArr.entries()) {
    // if accum does not exist we start from second item (first goes as an accum) so start index should be index + 1
    accumHolder = await Promise.resolve(callBack(accumHolder as any, item, index + indexShift, ctxArray));
  }

  return accumHolder as any;
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

async function asyncFind<T = unknown>(
  ctxArray: T[],
  callBack: (item: T, index: number, arr: T[]) => Promise<any>,
): Promise<T> {
  if (!isArray(ctxArray)) {
    throw new TypeError(`asyncFind(): first argument should be an array, current arg is ${getType(ctxArray)}`);
  }

  if (!isAsyncFunction(callBack) && !isFunction(callBack)) {
    throw new TypeError(
      `asyncFind(): second argument should be a function or async function, current arg is ${getType(callBack)}`,
    );
  }

  for (const [index, item] of ctxArray.entries()) {
    const res = await callBack(item, index, ctxArray);
    if (res) return item;
  }
}

export { asyncRepeat, asyncMap, asyncForEach, asyncReduce, asyncEvery, asyncSome, asyncFilter, asyncFind };
