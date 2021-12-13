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

	it('[P] compareToPattern check length only', function() {
		{
			const pattern = {
				c: {length: 3}
			};

			const data = {
				c: [1, 1, 1]
			};

			const {result, message} = compareToPattern(data, pattern, {strictArrays: false});
			deepStrictEqual(result, true, 'Should be same');
			deepStrictEqual(message, '', 'Message should be empty');
		}
		{
			const data = {
				topItem: {
					arrayItem: [
						{
							item1: true,
							item2: true,
							item3: false
						},
						{
							item1: true,
							item2: true,
							item3: false
						},
						{
							item1: true,
							item2: true,
							item3: false
						},
						{
							item1: true,
							item2: true,
							item3: false
						}
					]
				}
			};

			const pattern = {
				topItem: {
					arrayItem: {
						item1: true,
						item2: true,
						item3: {length: '>=0 and <=3'}
					}
				}
			};
		}
	});

	it('[P] compareToPattern check toCompare primitive', function() {
		const pattern = {
			c: {toCompare: 1}
		};

		const data = {
			c: [1, 1, 1]
		};

		const {result, message} = compareToPattern(data, pattern, {strictArrays: false});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern check toCompare array', function() {
		const pattern = {
			c: {toCompare: [1, 1, 1]}
		};

		const data = {
			c: [1, 1, 1]
		};

		const {result, message} = compareToPattern(data, pattern, {strictArrays: false});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern check toCompare array with ignore indexes', function() {
		const pattern = {
			c: {toCompare: [1, 1, 1], ignoreIndexes: [0, 1]}
		};

		const data = {
			c: [2, 3, 1, 1, 1]
		};

		const {result, message} = compareToPattern(data, pattern);
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[N] compareToPattern check toCompare array with ignore indexes', function() {
		const pattern = {
			c: {toCompare: [1, 1, 1], ignoreIndexes: [0, 4]}
		};

		const data = {
			c: [2, 3, 1, 1, 1]
		};

		const {result, message} = compareToPattern(data, pattern);
		deepStrictEqual(result, false, 'Should not same');
		deepStrictEqual(message, 'c[0]->Message: expected: 1, actual: 3', 'Message should be empty');
	});

	it('[P] compareToPattern check compareArrays', function() {
		const pattern = {
			c: [1, 1, 1],
		};

		const data = {
			c: [1, 1, 1]
		};

		const {result, message} = compareToPattern(data, pattern, {strictArrays: false});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] compareToPattern ignoreProperties', function() {
		const pattern = {
			c: {a: 3},
			shouldBeIgnored: {a: 'b'}
		};

		const data = {
			c: {a: 3},
			shouldBeIgnored: {a: 'xx'},
		};

		const {result, message} = compareToPattern(data, pattern, {ignoreProperties: 'shouldBeIgnored'});
		deepStrictEqual(result, true, 'Should be same');
		deepStrictEqual(message, '', 'Message should be empty');
	});

	it('[P] ignoreProperties for arr', function() {
		const data = {
			a: {
				b: [{
					c: true,
					d: [
						true
					]
				}]
			}
		};
		const pattern = {
			a: {
				b: {
					c: true,
					d: {length: '>0 and <= 3', test: null}
				}
			}
		};

		const {result, message} = compareToPattern(data, pattern, {ignoreProperties: ['test']});
		deepStrictEqual(result, true, `Should be same ${message}`);
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
				'b[3]->c->Message: seems like types are not comparable, expected: object, actual: string',
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
			deepStrictEqual(message, 'b[3]->c->d[2]->text->Message: expected: 1, actual: undefined', 'Message should be empty');
		}
	});
});
