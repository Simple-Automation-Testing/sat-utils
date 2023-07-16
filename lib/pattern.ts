/**
 * @param {Function} ctro costructor function
 * @returns {any} instance
 */
function wrapAsSingleton(ctro) {
  let instance;
  return function (...args) {
    if (instance) return instance;
    instance = new ctro(...args);

    return instance;
  };
}

export { wrapAsSingleton };
