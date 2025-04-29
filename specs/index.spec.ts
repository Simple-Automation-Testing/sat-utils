/* eslint-disable unicorn/consistent-function-scoping */
import { deepStrictEqual } from 'assert';
import {
  getRandomString,
  getRandomArrayItem,
  execNumberExpression,
  prettifyCamelCase,
  safeHasOwnPropery,
  lengthToIndexesArray,
} from '../lib';

describe('SPEC', function () {
  it('[P] lengthToIndexesArray', function () {
    deepStrictEqual(lengthToIndexesArray(2), [0, 1]);
  });

  it('[N] lengthToIndexesArray', function () {
    try {
      // @ts-ignore
      lengthToIndexesArray('');
    } catch (error) {
      deepStrictEqual(
        error.toString(),
        'TypeError: lengthToIndexes(): first argument should be a number, current arg is string',
      );
    }
  });

  it('[P] getRandomArrayItem', function () {
    const arr = [1, 2, 3, 4];
    {
      const res = getRandomArrayItem(arr, 2);
      deepStrictEqual(
        res.every(i => typeof i === 'number'),
        true,
      );
      deepStrictEqual(res.length, 2);
      deepStrictEqual(arr, [1, 2, 3, 4]);
    }
    {
      const res = getRandomArrayItem(arr);
      deepStrictEqual(typeof res === 'number', true);
      deepStrictEqual(arr, [1, 2, 3, 4]);
    }
  });

  it('[P] safeHasOwnPropery', function () {
    deepStrictEqual(safeHasOwnPropery({ a: 1, [Symbol['a']]: 1 }, 'a'), true);
    deepStrictEqual(safeHasOwnPropery({ a: 1 }, 'b'), false);
    deepStrictEqual(safeHasOwnPropery(undefined, 'b'), false);
    deepStrictEqual(safeHasOwnPropery(null, 'b'), false);
    deepStrictEqual(
      safeHasOwnPropery(function test() {
        /** */
      }, 'name'),
      true,
    );
  });

  it('[P] getRandomString', function () {
    const firstRes = getRandomString(1);
    deepStrictEqual(firstRes.length, 1, 'Should be one letter in random string');

    const secondRes = getRandomString(1, { numbers: true });
    deepStrictEqual(typeof Number(secondRes) === 'number', true, 'Should be a number');
    // @ts-ignore
    deepStrictEqual(secondRes == Number(secondRes), true, 'Should be equal');
  });

  it('[N] getRandomString', function () {
    try {
      getRandomString('rr');
    } catch (error) {
      deepStrictEqual(
        error.toString().includes('getRandomString(): first argument should be a number, current arg is string'),
        true,
        'Error shold have clear message about first argument',
      );
    }

    try {
      getRandomString(10, {});
    } catch (error) {
      deepStrictEqual(
        error.toString().includes('Error: getRandomString(): second argument should be an object with next opts'),
        true,
        'Error shold have clear message about second argument',
      );
    }
  });

  it('[P] execNumberExpression', function () {
    deepStrictEqual(execNumberExpression('>10 and <15', 11), true, '11 shoult be in range from 10 to 15');
    deepStrictEqual(execNumberExpression('>10 and <9', 11), false, '11 shoult be in range from 10 to 9');
  });

  it('[P] prettifyCamelCase', function () {
    const str = 'prettifyCamelCase';

    const res1 = prettifyCamelCase(str);
    deepStrictEqual('Prettify Camel Case', res1);

    const res2 = prettifyCamelCase(str, { joinWords: '__' });
    deepStrictEqual('Prettify__Camel__Case', res2);

    const res3 = prettifyCamelCase(str, { allUpperCase: true, joinWords: '_' });
    deepStrictEqual('PRETTIFY_CAMEL_CASE', res3);

    const res4 = prettifyCamelCase(str, { firstWordUpperCase: true });
    deepStrictEqual('Prettify camel case', res4);
  });
});
