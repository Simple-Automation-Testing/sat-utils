import {deepStrictEqual} from 'assert';
import {compareToPattern} from '../lib';

describe('SPEC', function() {
	it('[P] compareToPattern onlyObject', function() {
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

		const {result, message} = compareToPattern(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern with array', function() {
		const pattern = {
			c: {a: 1}
		};

		const data = {
			c: [{a: 1}]
		};

		const {result, message} = compareToPattern(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern with sub arrays', function() {
		const pattern = {
			c: {a: {b: {c: {d: 12}}}}
		};

		const data = {
			c: [{a: [{b: [{c: [{d: 12}]}]}]}]
		};

		const {result, message} = compareToPattern(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern with length', function() {
		const pattern = {
			c: {
				length: 1,
				a: 'test',
			}
		};

		const data = {
			c: [{a: 'test'}]
		};

		const {result, message} = compareToPattern(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern strictStrings false', function() {
		const pattern = {
			c: {
				length: 1,
				a: 'different part',
			}
		};

		const data = {
			c: [{a: 'long string with different parts'}]
		};

		const {result, message} = compareToPattern(data, pattern, {strictStrings: false});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern strictStrings strictArrays', function() {
		const pattern = {
			c: {a: 3}
		};

		const data = {
			c: [{a: 2}, {a: 3}, {a: 2}, {a: 2}]
		};

		const {result, message} = compareToPattern(data, pattern, {strictArrays: false});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[N] compareToPattern missed fields', function() {
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

			const {result, message} = compareToPattern(data, pattern);
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

			const {result, message} = compareToPattern(data, pattern);
			deepStrictEqual(result, false, 'Should not be same');
			deepStrictEqual(
				message,
				'b->[3]c->Message: seems like types are not comparable, expected: object, actual: string',
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

			const {result, message} = compareToPattern(data, pattern);
			deepStrictEqual(result, false, 'Should not be same');
			deepStrictEqual(message, 'b->[3]c->d->[2]text->Message: expected: 1, actual: undefined', 'Message should be empty');
		}
	});
});
