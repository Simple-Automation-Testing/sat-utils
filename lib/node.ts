/**
 * Dynamically compiles a CommonJS module from source code.
 * @param {string} src The source code of the CommonJS module to compile.
 * @param {string} [filename=''] The filename of the module (optional).
 * @returns {any} The exports object of the compiled module.
 */
function getCommonJsModuleFromSourceString(src: string, filename = '') {
  // Get the constructor function for creating module instances
  const Module = module.constructor;

  // Create a new module instance
  // @ts-expect-error: TypeScript doesn't have explicit typings for module constructor
  const mod = new Module();

  // Compile the source code within the context of the module instance
  mod._compile(src, filename);

  // Return the exports object of the compiled module
  return mod.exports;
}

export { getCommonJsModuleFromSourceString };
