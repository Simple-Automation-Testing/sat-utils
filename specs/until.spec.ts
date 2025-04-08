/* eslint-disable unicorn/consistent-function-scoping */
import { deepStrictEqual } from 'assert';
import { getStringEqualtyPersentage } from '../lib/utils';

describe('UTILS', function () {
  it('[P] getStringEqualtyPersentage', async function () {
    const str1 = 'abc';
    const str2 = 'abc';
    const str3 = 'abcd';

    deepStrictEqual(getStringEqualtyPersentage(str1, str2), 100);
    deepStrictEqual(getStringEqualtyPersentage(str1, str3), 75);
    deepStrictEqual(getStringEqualtyPersentage(str2, str3), 75);
  });
});
