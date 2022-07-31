import { deepStrictEqual } from 'assert';
import { millisecondsToMinutes } from '../lib';

describe('formatter', () => {
  it('[P] millisecondsToMinutes', () => {
    deepStrictEqual(millisecondsToMinutes(25_000), '0:25');
    deepStrictEqual(millisecondsToMinutes(250_000), '4:10');
  });
});
