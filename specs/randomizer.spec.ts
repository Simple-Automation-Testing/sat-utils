/* eslint-disable unicorn/consistent-function-scoping */
import { deepStrictEqual } from 'assert';
import { getUniqItems } from '../lib';

describe('RANDOMIZER', function () {
  it('[P] getUniqItems primitives', async function () {
    const arr = [1, 1, 1, 4];

    deepStrictEqual(getUniqItems(arr), [1, 4]);
  });

  it('[P] getUniqItems fields one field', async function () {
    const arr = [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 4 }];

    deepStrictEqual(getUniqItems(arr, 'a'), [{ a: 1 }, { a: 4 }]);
  });

  it('[P] getUniqItems fields few fields', async function () {
    const arr = [
      { a: 1, b: 1 },
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 4, b: 2 },
    ];

    deepStrictEqual(getUniqItems(arr, ['a', 'b']), [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 4, b: 2 },
    ]);
  });

  it('[P] getUniqItems fields few fields', async function () {
    const arr = [
      { a: 1, b: 1 },
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 4, b: 2 },
    ];

    const compare = (currentItems, initalArrItem) => {
      return currentItems.some(item => {
        return !(item.a === initalArrItem.a && item.b === initalArrItem.b);
      });
    };
    deepStrictEqual(getUniqItems(arr, compare), [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 4, b: 2 },
    ]);
  });
});
