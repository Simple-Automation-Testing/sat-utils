/* eslint-disable no-console */
/* eslint-disable unicorn/consistent-function-scoping */
import { deepStrictEqual } from 'assert';
import { getStringEqualtyPersentage, stringifyData } from '../lib/utils';

describe('UTILS', function () {
  it('[P] getStringEqualtyPersentage', async function () {
    const str1 = 'abc';
    const str2 = 'abc';
    const str3 = 'abcd';

    deepStrictEqual(getStringEqualtyPersentage(str1, str2), 100);
    deepStrictEqual(getStringEqualtyPersentage(str1, str3), 75);
    deepStrictEqual(getStringEqualtyPersentage(str2, str3), 75);
  });

  it('[P] stringifyData', async function () {
    const obj = {
      b: [{ b: 1 }],
      c: {
        c: () => console.log('stringifyData'),
      },
    };
    deepStrictEqual(stringifyData(obj), `{b: [{b: 1}], c: {c: () => console.log('stringifyData')}}`);
  });
});
