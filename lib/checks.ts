import { AssertionError } from 'assert';

import { compareToPattern } from './compare';
import { toArray } from './utils';

import type { TCompareOpts } from './compare';

/**
 * Checks that an array includes specified items using pattern matching.
 *
 * @param {any[]} arr - The array to be checked.
 * @param {any|any[]} items - The items to check for inclusion in the array.
 * @param {TCompareOpts} [opts={}] - Options for the comparison.
 * @throws {AssertionError} Throws an error if the check fails.
 */
function checkThatArrayIncludes(arr, items, opts: TCompareOpts = {}) {
  const { result, message } = compareToPattern(arr, toArray(items, true), { ...opts, dataIncludesMembers: true });

  if (!result) {
    throw new AssertionError({
      message,
      expected: items,
      actual: arr,
    });
  }
}

/**
 * Checks that an object includes specified properties and values using pattern matching.
 *
 * @param {{[k: string]: any}} objA - The object to be checked.
 * @param {{[k: string]: any}} objB - The object specifying properties and values to check for inclusion.
 * @param {TCompareOpts} [opts={}] - Options for the comparison.
 * @throws {AssertionError} Throws an error if the check fails.
 */
function checkThatObjectIncludes(objA, objB, opts: TCompareOpts = {}) {
  const { result, message } = compareToPattern(objA, objB, opts);

  if (!result) {
    throw new AssertionError({
      message,
      expected: objB,
      actual: objA,
    });
  }
}

/**
 * Checks that a string includes a specified substring using pattern matching.
 *
 * @param {string} str - The string to be checked.
 * @param {string} strPart - The substring to check for inclusion in the string.
 * @param {TCompareOpts} [opts={}] - Options for the comparison.
 * @throws {AssertionError} Throws an error if the check fails.
 */
function checkThatStringIncludes(str, strPart, opts: TCompareOpts = {}) {
  const { result, message } = compareToPattern(str, strPart, { ...opts, stringIncludes: true });

  if (!result) {
    throw new AssertionError({
      message,
      expected: str,
      actual: strPart,
    });
  }
}

/**
 * Checks that two strings are equal using pattern matching.
 *
 * @param {string} strA - The first string to be compared.
 * @param {string} strB - The second string to be compared.
 * @param {TCompareOpts} [opts={}] - Options for the comparison.
 * @throws {AssertionError} Throws an error if the check fails.
 */
function checkThatStringEquals(strA, strB, opts: TCompareOpts = {}) {
  const { result, message } = compareToPattern(strA, strB, { ...opts, stringIncludes: true });

  if (!result) {
    throw new AssertionError({
      message,
      expected: strB,
      actual: strA,
    });
  }
}

export { checkThatArrayIncludes, checkThatObjectIncludes, checkThatStringIncludes, checkThatStringEquals };
