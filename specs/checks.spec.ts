import { deepStrictEqual } from 'assert';

import { checkThatArrayIncludes, checkThatObjectIncludes } from '../lib';

describe('Checks', function () {
  it('[P] checkThatArrayIncludes', function () {
    {
      checkThatArrayIncludes(['a', 'b', 'c'], 'c');
    }
  });

  it('[P] checkThatObjectIncludes', function () {
    {
      checkThatObjectIncludes({ a: 1, b: 1, c: 1 }, { c: 1 });
    }
  });
});
