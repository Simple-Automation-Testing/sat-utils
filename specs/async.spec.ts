/* eslint-disable unicorn/consistent-function-scoping, unicorn/no-useless-undefined*/
import { deepStrictEqual } from 'assert';
import { asyncRepeat, asyncMap, asyncForEach, asyncReduce, asyncEvery, asyncSome } from '../lib';

describe('async', () => {
  it('[P] asyncSome', async () => {
    {
      const arr = [1, 2, 3];
      const res = await asyncSome(arr, async item => new Promise(res => setTimeout(() => res(item === 3), 25)));
      deepStrictEqual(res, true);
    }
  });

  it('[P] asyncEvery', async () => {
    {
      const arr = [1, 2, 3];
      const res = await asyncEvery(arr, async item => new Promise(res => setTimeout(() => res(item > 0), 25)));
      deepStrictEqual(res, true);
    }
  });

  it('[P] asyncReduce', async () => {
    {
      const arr = [1, 2, 3];
      const cb = async (acc, item) => new Promise(res => setTimeout(() => res(acc + item), 25));
      const res = await asyncReduce(arr, cb);
      deepStrictEqual(res, 6);
    }
    {
      const arr = [1, 2, 3];
      const cb = async (acc, item) => new Promise(res => setTimeout(() => res(acc + item), 25));
      const res = await asyncReduce(arr, cb, 0);
      deepStrictEqual(res, 6);
    }
    {
      const arr = [1, 2, 3];
      const cb = async (acc, item) => new Promise(res => setTimeout(() => res(acc + item), 25));
      const res = await asyncReduce(arr, cb, 1);
      deepStrictEqual(res, 7);
    }
    {
      const res = await asyncReduce(
        [1, 2, 3],
        async (acc, item) => new Promise(res => setTimeout(() => res(acc + item), 25)),
        1,
      );
      deepStrictEqual(res, 7);
    }
  });

  it('[P] asyncRepeat', async () => {
    {
      let i = 0;

      await asyncRepeat(2, async () => {
        i++;
      });

      deepStrictEqual(i, 2);
    }
    {
      let i = 0;

      await asyncRepeat(0, async () => {
        i++;
      });

      deepStrictEqual(i, 0);
    }
    {
      let i = 0;

      await asyncRepeat(
        2,
        async () => {
          i++;
          throw new Error('!!!!!!!!!!!!');
        },
        true,
      );

      deepStrictEqual(i, 2);
    }
  });

  it('[P] asyncMap', async () => {
    const item = [1, 2, 3];

    const result = await asyncMap(item, i => new Promise(res => setTimeout(() => res(i + 1), 2)));
    deepStrictEqual(result, [2, 3, 4]);
  });

  it('[P] asyncForEach', async () => {
    const item = [1, 2, 3];
    let itemResulter = 0;
    const result = await asyncForEach(
      item,
      (i, index) =>
        new Promise(res =>
          setTimeout(() => {
            itemResulter += i;
            item[index]++;
            res();
          }, 2),
        ),
    );
    deepStrictEqual(item, [2, 3, 4]);
    deepStrictEqual(itemResulter, 6);
    // eslint-disable-next-line
    deepStrictEqual(result, undefined);
  });
});
