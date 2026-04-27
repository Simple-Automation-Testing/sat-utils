/* eslint-disable unicorn/consistent-function-scoping */
import { deepStrictEqual } from 'assert';
import {
  getRandomString,
  getRandomArrayItem,
  execNumberExpression,
  prettifyCamelCase,
  safeHasOwnPropery,
  lengthToIndexesArray,
  isFuzzyMatch,
  isNgram,
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

  it('[P] isFuzzyMatch - typo within default range matches', function () {
    deepStrictEqual(isFuzzyMatch('kitten', 'sitting'), true);
    deepStrictEqual(isFuzzyMatch('hello', 'hallo'), false);
    deepStrictEqual(isFuzzyMatch('hello', 'help'), true);
  });

  it('[P] isFuzzyMatch - identical strings are not a fuzzy match by default', function () {
    deepStrictEqual(isFuzzyMatch('abc', 'abc'), false);
  });

  it('[P] isFuzzyMatch - very different strings exceed default max', function () {
    deepStrictEqual(isFuzzyMatch('abc', 'xyzqwerty'), false);
  });

  it('[P] isFuzzyMatch - custom min/max range', function () {
    deepStrictEqual(isFuzzyMatch('abc', 'abd', 1, 1), true);
    deepStrictEqual(isFuzzyMatch('abc', 'abd', 2, 5), false);
    deepStrictEqual(isFuzzyMatch('abc', 'abc', 0, 0), true);
  });

  it('[P] isFuzzyMatch - coerces non-string inputs', function () {
    // @ts-ignore
    deepStrictEqual(isFuzzyMatch(12345, 12300), true);
    // @ts-ignore
    deepStrictEqual(isFuzzyMatch(null, 'null'), false);
  });

  it('[P] isFuzzyMatch - empty strings', function () {
    deepStrictEqual(isFuzzyMatch('', '', 0, 0), true);
    deepStrictEqual(isFuzzyMatch('', 'abcd'), true);
    deepStrictEqual(isFuzzyMatch('', 'abcdefgh'), false);
  });

  it('[P] isNgram - forward chunk found in fullName', function () {
    deepStrictEqual(isNgram('abcd', 'XYZcdQ'), true);
    deepStrictEqual(isNgram('abc', 'XYabZ'), true);
  });

  it('[P] isNgram - reversed chunk found in fullName', function () {
    deepStrictEqual(isNgram('ab', 'xba y'), true);
  });

  it('[P] isNgram - no chunk match returns false', function () {
    deepStrictEqual(isNgram('xy', 'abcd'), false);
    deepStrictEqual(isNgram('abcd', 'qrstuv'), false);
  });

  it('[P] isNgram - phrase shorter than minGram returns false', function () {
    deepStrictEqual(isNgram('a', 'abc'), false);
    deepStrictEqual(isNgram('ab', 'abc', 3), false);
  });

  it('[P] isNgram - is case-insensitive', function () {
    deepStrictEqual(isNgram('AB', 'xab'), true);
    deepStrictEqual(isNgram('ab', 'XAB'), true);
  });

  it('[P] isNgram - custom minGram', function () {
    deepStrictEqual(isNgram('abc', 'xabcy', 3), true);
    deepStrictEqual(isNgram('xyzab', 'just ab here', 3), false);
  });

  it('[P] isNgram - recurses through offsets to find a match', function () {
    deepStrictEqual(isNgram('xyzab', 'just ab here'), true);
  });

  it('[P] isNgram - identical strings match', function () {
    deepStrictEqual(isNgram('abc', 'abc'), true);
  });
});
