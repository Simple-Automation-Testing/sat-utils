import {deepStrictEqual} from 'assert';
import {compareToPatter} from '../lib';

describe('SPEC', function() {
	it('[P] compareToPatter onlyObject', function() {
		const pattern = {
			a: {text: 'first'},
			b: {
				c: {d: {text: 'second'}}
			}
		};

		const data = {
			a: {text: 'first'},
			b: {
				c: {d: {text: 'second'}}
			}
		};

		const {result, message} = compareToPatter(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPatter with array', function() {
		const pattern = {
			c: {a: 1}
		};

		const data = {
			c: [{a: 1}]
		};

		const {result, message} = compareToPatter(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPatter with length', function() {
		const pattern = {
			c: {
				length: 1,
				a: 'test',
			}
		};

		const data = {
			c: [{a: 'test'}]
		};

		const {result, message} = compareToPatter(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPatter strictStrings false', function() {
		const pattern = {
			c: {
				length: 1,
				a: 'different part',
			}
		};

		const data = {
			c: [{a: 'long string with different parts'}]
		};

		const {result, message} = compareToPatter(data, pattern, {strictStrings: false});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPatter strictStrings strictArrays', function() {
		const pattern = {
			c: {a: 3}
		};

		const data = {
			c: [{a: 2}, {a: 3}, {a: 2}, {a: 2}]
		};

		const {result, message} = compareToPatter(data, pattern, {strictArrays: false});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it.only('[N] compareToPatter missed fields', function() {
		{
			const pattern = {
				a: {text: 'first'},
				b: {
					c: {d: {text: 'c'}}
				}
			};

			const data = {
				a: {text: 'first'},
			};

			const {result, message} = compareToPatter(data, pattern);
			deepStrictEqual(result, false, 'Should not be same');
			deepStrictEqual(
				message,
				'b->Message: seems like types are not comparable, expected: object, actual: undefined',
				'Message should be empty'
			);
		}
		{
			const pattern = {
				a: {text: 'first'},
				b: {
					c: {d: {text: 'c'}}
				}
			};

			const data = {
				a: {text: 'first'},
				b: [
					{c: {d: {text: 'c'}}},
					{c: {d: {text: 'c'}}},
					{c: {d: {text: 'c'}}},
					{c: 'str'}
				]
			};

			const {result, message} = compareToPatter(data, pattern);
			deepStrictEqual(result, false, 'Should not be same');
			deepStrictEqual(
				message,
				'b->c->[3] Message: seems like types are not comparable, expected: object, actual: string',
				'Message should be empty'
			);
		}

		{
			const pattern = {
				a: {text: 'first'},
				b: {
					c: {d: {text: 1}}
				}
			};

			const data = {
				a: {text: 'first'},
				b: [
					{c: {d: [{text: 1}]}},
					{c: {d: [{text: 1}]}},
					{c: {d: [{text: 1}]}},
					{c: {d: [{text: 1}, {text: 1}, {z: 1}]}},
				]
			};

			const {result, message} = compareToPatter(data, pattern);
			deepStrictEqual(result, false, 'Should not be same');
			deepStrictEqual(message, 'b->seems like types are not comparable, expected: object, actual: undefined', 'Message should be empty');
		}
	});
});
