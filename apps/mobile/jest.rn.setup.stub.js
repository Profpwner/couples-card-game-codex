// Minimal RN jest setup stub to avoid Flow-typed upstream file under Node 22
global.__DEV__ = true;

// Polyfill setImmediate/clearImmediate for jsdom environment
if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
if (typeof global.clearImmediate === 'undefined') {
  global.clearImmediate = (id) => clearTimeout(id);
}
