/**
 * Wraps a constructor function as a singleton to ensure only one instance is created.
 *
 * @param {Function} ctro - The constructor function to be wrapped as a singleton.
 * @returns {Function} A function that, when called, returns the single instance of the constructor.
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
