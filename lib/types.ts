// eslint-disable-next-line max-len
type expectedArg =
  | 'regExp'
  | 'object'
  | 'array'
  | 'set'
  | 'function'
  | 'asyncFunction'
  | 'promise'
  | 'null'
  | 'string'
  | 'undefined'
  | 'symbol'
  | 'number'
  | 'boolean';

const typesEnum = {
  object: '[object Object]',
  array: '[object Array]',
  set: '[object Set]',
  map: '[object Map]',
  function: '[object Function]',
  asyncFunction: '[object AsyncFunction]',
  promise: '[object Promise]',
  regExp: '[object RegExp]',

  null: '[object Null]',
  string: '[object String]',
  undefined: '[object Undefined]',
  symbol: '[object Symbol]',
  number: '[object Number]',
  boolean: '[object Boolean]',
  arguments: '[object Arguments]',
};

const pritiveTypes = [
  '[object Null]',
  'null',
  '[object String]',
  'string',
  '[object Undefined]',
  'undefined',
  '[object Number]',
  'number',
  '[object Boolean]',
  'boolean',
  '[object Symbol]',
  'symbol',
];

const typesReverseEnum = {
  '[object Object]': 'object',
  '[object Array]': 'array',
  '[object Set]': 'set',
  '[object Function]': 'function',
  '[object AsyncFunction]': 'asyncFunction',
  '[object Promise]': 'promise',
  '[object Map]': 'map',
  '[object RegExp]': 'regExp',

  '[object Symbol]': 'symbol',
  '[object Null]': 'null',
  '[object String]': 'string',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
};

function isPrimitive(arg: any) {
  return pritiveTypes.includes(Object.prototype.toString.call(arg));
}

function getType(arg: any) {
  return typesReverseEnum[Object.prototype.toString.call(arg)];
}

function isObject(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.object;
}

function isArray(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.array;
}

function isNull(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.null;
}

function isString(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.string;
}

function isUndefined(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.undefined;
}

function isSet(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.set;
}

function isMap(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.map;
}

function isSymbol(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.symbol;
}

function isNumber(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.number && !Number.isNaN(arg);
}

function isBoolean(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.boolean;
}

function isFunction(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.function;
}

function isAsyncFunction(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.asyncFunction;
}

function isPromise(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.promise;
}

function isRegExp(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.regExp;
}

function isDate(arg: any) {
  return arg instanceof Date;
}

function isArguments(arg: any) {
  return Object.prototype.toString.call(arg) === typesEnum.arguments;
}

function isType(arg, typeArg: expectedArg) {
  return Object.prototype.toString.call(arg) === typesEnum[typeArg];
}

function canBeProxed(arg) {
  try {
    new Proxy(arg, {});
    return true;
  } catch {
    return false;
  }
}

function isEmptyArray(arg: any) {
  return isArray(arg) && Boolean(arg.length);
}

function isNotEmptyArray(arg: any) {
  return isArray(arg) && !!arg.length;
}

function isEmptyObject(arg: any) {
  return isObject(arg) && !Object.keys(arg).length;
}

function isNotEmptyObject(arg: any) {
  return isObject(arg) && !!Object.keys(arg).length;
}

export {
  isArray,
  isObject,
  isNull,
  isString,
  isSet,
  isMap,
  isUndefined,
  isNumber,
  isPromise,
  isBoolean,
  isSymbol,
  isFunction,
  isRegExp,
  isAsyncFunction,
  isDate,
  isArguments,
  typesEnum,
  expectedArg,
  isType,
  getType,
  isPrimitive,
  canBeProxed,
  isEmptyArray,
  isEmptyObject,
  isNotEmptyArray,
  isNotEmptyObject,
};
