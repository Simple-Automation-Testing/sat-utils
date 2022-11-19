/* eslint-disable unicorn/consistent-function-scoping */
import { deepStrictEqual } from 'assert';
import { waitForCondition } from '../lib';

describe('SPEC', function () {
  const noop = () => true;

  it('[P] waitForCondition before/after', async function () {
    let callBefore = 0;
    let callAfter = 0;

    const before = () => (callBefore += 1);
    const after = () => (callAfter += 1);

    await waitForCondition(noop, { before, after });

    deepStrictEqual(callAfter, 1);
    deepStrictEqual(callBefore, 1);
  });

  it('[N] waitForCondition before/after', async function () {
    let callBefore = 0;
    let callAfter = 0;

    const before = () => (callBefore += 1);
    const after = () => (callAfter += 1);

    await waitForCondition(
      () => {
        throw new Error('!');
      },
      { before, after, dontThrow: true, timeout: 250, interval: 100 },
    );

    deepStrictEqual(callAfter, 1);
    deepStrictEqual(callBefore, 1);
  });

  it('[P] waitForCondition falseIfError', async function () {
    const throwFunction = () => {
      throw new Error('TEST');
    };

    const result = await waitForCondition(throwFunction, { dontThrow: true, timeout: 1500, interval: 50 });

    deepStrictEqual(result, false);
  });

  it('[P] waitForCondition stopIfNoError', async function () {
    const returnFalse = () => Promise.resolve(false);
    const result = await waitForCondition(returnFalse, { stopIfNoError: true });

    deepStrictEqual(result, false);
  });

  it('[N] waitForCondition stopIfNoError', async function () {
    const returnFalse = async () => {
      throw new Error('AAAA');
    };
    const result = await waitForCondition(returnFalse, { stopIfNoError: true, dontThrow: true });

    deepStrictEqual(result, false);
  });

  it('[N] waitForCondition falseIfError', async function () {
    const throwError = new Error('TEST');
    const throwFunction = () => {
      throw throwError;
    };

    try {
      await waitForCondition(throwFunction, { falseIfError: false, timeout: 1500, interval: 50 });
    } catch (error) {
      deepStrictEqual(throwError, error);
    }
  });
});
