/* eslint-disable unicorn/consistent-function-scoping */
import { strictEqual } from 'assert';
import { wrapAsSingleton } from '../lib';

describe('PATTERN', function () {
  it('[P] wrapAsSingleton', async function () {
    class A {}
    const init = wrapAsSingleton(A);

    const a = init();
    const b = init();
    strictEqual(a, b);
  });
});
