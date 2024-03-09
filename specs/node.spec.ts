/* eslint-disable unicorn/consistent-function-scoping */
import { deepStrictEqual } from 'assert';
import { getCommonJsModuleFromSourceString } from '../lib';

describe('NODE', function () {
  it('[P] getCommonJsModuleFromSourceString', async function () {
    const moduleFromSourceCode = getCommonJsModuleFromSourceString(`
const noop = require('${__dirname}/noop.js');
const a = 10;
module.exports = {
	a,
	noop
}
		`);
    deepStrictEqual(moduleFromSourceCode, { a: 10, noop: { hey: 10 } });
  });
});
