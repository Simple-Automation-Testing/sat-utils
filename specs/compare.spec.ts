import { deepStrictEqual } from 'assert';
import { compareToPattern } from '../lib';

describe('SPEC', function () {
  it('[P] compareToPattern patternToLowercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.patternToLowercase('12ADS') },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compareToPattern.patternToLowercase('12ADS') },
      };
      const data = {
        field: { a: '12ads12342121' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compareToPattern patternToLowercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.patternToLowercase('12ADS') },
      };
      const data = {
        field: { a: '12ads222' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ads, actual: 12ads222 pattern is lowercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compareToPattern patternToUppercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.patternToUppercase('12ads') },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compareToPattern.patternToUppercase('12ads') },
      };
      const data = {
        field: { a: '12ADS12342121' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compareToPattern patternToUppercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.patternToUppercase('12ads') },
      };
      const data = {
        field: { a: '12ADS121' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ADS, actual: 12ADS121 pattern is uppercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compareToPattern dataToLowercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.dataToLowercase('12ads') },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compareToPattern.dataToLowercase('12ads') },
      };
      const data = {
        field: { a: '12ADS12342121' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compareToPattern dataToLowercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.dataToLowercase('12ads111') },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ads111, actual: 12ads data is lowercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compareToPattern dataToUppercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.dataToUppercase('12ADS') },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compareToPattern.dataToUppercase('12ADS') },
      };
      const data = {
        field: { a: '12ads12342121' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compareToPattern dataToUppercase', function () {
    {
      const pattern = {
        field: { a: compareToPattern.dataToUppercase('12ADS') },
      };
      const data = {
        field: { a: '12adsaaa' },
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ADS, actual: 12ADSAAA data is uppercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compareToPattern stringLowercase', function () {
    {
      const pattern = {
        field: { a: '12ADS' },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: '12ads' },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compareToPattern stringLowercase', function () {
    {
      const pattern = {
        field: { a: '12ADSa' },
      };
      const data = {
        field: { a: '12asd' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12adsa, actual: 12asd data and pattern are lowercased',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        field: { a: '12asd' },
      };
      const data = {
        field: { a: '12ADSa' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12asd, actual: 12adsa data and pattern are lowercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compareToPattern stringUppercase', function () {
    {
      const pattern = {
        field: { a: '12ADS' },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: '12ads' },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compareToPattern stringLowercase', function () {
    {
      const pattern = {
        field: { a: '12ADSa' },
      };
      const data = {
        field: { a: '12asd' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ADSA, actual: 12ASD data and pattern are uppercased',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        field: { a: '12asd' },
      };
      const data = {
        field: { a: '12ADSa' },
      };
      const { result, message } = compareToPattern(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ASD, actual: 12ADSA data and pattern are uppercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compareToPattern allowNumberTypecast', function () {
    {
      const pattern = {
        field: { a: 1 },
      };
      const data = {
        field: { a: '1' },
      };
      const { result, message } = compareToPattern(data, pattern, { allowNumberTypecast: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: 1 },
      };
      const data = {
        field: { a: '        1          ' },
      };
      const { result, message } = compareToPattern(data, pattern, { allowNumberTypecast: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compareToPattern allowEmptyArray', function () {
    {
      const pattern = {
        field: { a: 1 },
      };
      const data = {
        field: [],
      };
      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: 1 },
      };
      const data = {
        field: [],
      };
      const { result, message } = compareToPattern(data, pattern, { allowEmptyArray: false });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->Message: expected length: >0, actual lenght: 0', 'Message should not be empty');
    }
    {
      const pattern = {
        field: { length: 0 },
      };
      const data = {
        field: [],
      };
      const { result, message } = compareToPattern(data, pattern, { allowEmptyArray: false });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compareToPattern _check_number', function () {
    {
      const pattern = {
        field: compareToPattern.toCheckNumber('> 10'),
      };
      const data = {
        field: 11,
      };

      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: compareToPattern.toCheckNumber('> 10 and < 12'),
      };
      const data = {
        field: 11,
      };

      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compareToPattern _check_number', function () {
    {
      const pattern = {
        field: compareToPattern.toCheckNumber(' > 11'),
      };
      const data = {
        field: 11,
      };

      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->Message: expected: 11 > 11', 'Message should not be empty');
    }
  });

  it('[P] compareToPattern onlyObject', function () {
    const pattern = {
      a: { text: 'first' },
      b: {
        c: { d: { text: 'second' } },
      },
    };

    const data = {
      a: { text: 'first' },
      b: {
        c: { d: { text: 'second' } },
      },
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern with array', function () {
    const pattern = {
      c: { a: 1 },
    };

    const data = {
      c: [{ a: 1 }],
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern with sub arrays', function () {
    const pattern = {
      c: { a: { b: { c: { d: 12 } } } },
    };

    const data = {
      c: [{ a: [{ b: [{ c: [{ d: 12 }] }] }] }],
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern with length', function () {
    const pattern = {
      c: {
        length: 1,
        a: 'test',
      },
    };

    const data = {
      c: [{ a: 'test' }],
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern stringIncludes true', function () {
    const pattern = {
      c: {
        length: 1,
        a: 'different part',
      },
    };

    const data = {
      c: [{ a: 'long string with different parts' }],
    };

    const { result, message } = compareToPattern(data, pattern, { stringIncludes: true });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern _data_includes', function () {
    const pattern = {
      c: {
        length: 1,
        a: compareToPattern.toDataIncludes('different part'),
      },
    };

    const data = {
      c: [{ a: 'long string with different parts' }],
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern _pattern_includes', function () {
    const pattern = {
      c: {
        length: 1,
        a: compareToPattern.toPatternIncludes('long string with different parts'),
      },
    };

    const data = {
      c: [{ a: 'different part' }],
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern stringEquals everyArrayItem', function () {
    const pattern = {
      c: { a: 3 },
    };

    const data = {
      c: [{ a: 2 }, { a: 3 }, { a: 2 }, { a: 2 }],
    };

    const { result, message } = compareToPattern(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern check length only', function () {
    {
      const pattern = {
        c: { length: 3 },
      };

      const data = {
        c: [1, 1, 1],
      };

      const { result, message } = compareToPattern(data, pattern, { everyArrayItem: false });
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
              item3: false,
            },
            {
              item1: true,
              item2: true,
              item3: false,
            },
            {
              item1: true,
              item2: true,
              item3: false,
            },
            {
              item1: true,
              item2: true,
              item3: false,
            },
          ],
        },
      };

      const pattern = {
        topItem: {
          arrayItem: {
            item1: true,
            item2: true,
            item3: { length: '>=0 and <=3' },
          },
        },
      };
    }
  });

  it('[P] compareToPattern check toCompare primitive', function () {
    const pattern = {
      c: { toCompare: 1 },
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compareToPattern(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern check toCompare array', function () {
    const pattern = {
      c: { toCompare: [1, 1, 1] },
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compareToPattern(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern check toCompare array with ignore indexes', function () {
    const pattern = {
      c: { toCompare: [1, 1, 1], ignoreIndexes: [0, 1] },
    };

    const data = {
      c: [2, 3, 1, 1, 1],
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[N] compareToPattern check toCompare array with ignore indexes', function () {
    const pattern = {
      c: { toCompare: [1, 1, 1], ignoreIndexes: [0, 4] },
    };

    const data = {
      c: [2, 3, 1, 1, 1],
    };

    const { result, message } = compareToPattern(data, pattern);
    deepStrictEqual(result, false, 'Should not same');
    deepStrictEqual(message, 'c[0]->Message: expected: 1, actual: 3', 'Message should be empty');
  });

  it('[P] compareToPattern check compareArrays', function () {
    const pattern = {
      c: [1, 1, 1],
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compareToPattern(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compareToPattern ignoreProperties', function () {
    const pattern = {
      c: { a: 3 },
      shouldBeIgnored: { a: 'b' },
    };

    const data = {
      c: { a: 3 },
      shouldBeIgnored: { a: 'xx' },
    };

    const { result, message } = compareToPattern(data, pattern, { ignoreProperties: 'shouldBeIgnored' });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] ignoreProperties for arr', function () {
    const data = {
      a: {
        b: [
          {
            c: true,
            d: [true],
          },
        ],
      },
    };
    const pattern = {
      a: {
        b: {
          c: true,
          d: { length: '>0 and <= 3', test: null },
        },
      },
    };

    const { result, message } = compareToPattern(data, pattern, { ignoreProperties: ['test'] });
    deepStrictEqual(result, true, `Should be same ${message}`);
  });

  it('[N] compareToPattern missed fields', function () {
    {
      const pattern = {
        a: { text: 'first' },
        b: {
          c: { d: { text: 'c' } },
        },
      };

      const data = {
        a: { text: 'first' },
      };

      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should not be same');
      deepStrictEqual(
        message,
        'b->Message: seems like types are not comparable, expected: object, actual: undefined',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        a: { text: 'first' },
        b: {
          c: { d: { text: 'c' } },
        },
      };

      const data = {
        a: { text: 'first' },
        b: [{ c: { d: { text: 'c' } } }, { c: { d: { text: 'c' } } }, { c: { d: { text: 'c' } } }, { c: 'str' }],
      };

      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should not be same');
      deepStrictEqual(
        message,
        'b[3]->c->Message: seems like types are not comparable, expected: object, actual: string',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        a: { text: 'first' },
        b: {
          c: { d: { text: 1 } },
        },
      };

      const data = {
        a: { text: 'first' },
        b: [
          { c: { d: [{ text: 1 }] } },
          { c: { d: [{ text: 1 }] } },
          { c: { d: [{ text: 1 }] } },
          { c: { d: [{ text: 1 }, { text: 1 }, { z: 1 }] } },
        ],
      };

      const { result, message } = compareToPattern(data, pattern);
      deepStrictEqual(result, false, 'Should not be same');
      deepStrictEqual(
        message,
        'b[3]->c->d[2]->text->Message: expected: 1, actual: undefined',
        'Message should be empty',
      );
    }
  });
});
