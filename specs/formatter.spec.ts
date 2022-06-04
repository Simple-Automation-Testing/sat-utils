import { deepStrictEqual } from 'assert';
import { millisecondsToMinutes } from '../lib';

describe('formatter', () => {
  it('[P] millisecondsToMinutes', () => {
    deepStrictEqual(millisecondsToMinutes(25000), '0:25');
    deepStrictEqual(millisecondsToMinutes(250000), '4:10');
  });
});
