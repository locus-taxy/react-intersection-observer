import invariant from 'invariant';
var config = {};
export default Object.create(null, {
  errorReporter: {
    configurable: false,
    get: function get() {
      return config.errorReporter || function (format) {
        return invariant(false, format);
      };
    },
    set: function set(value) {
      if (typeof value !== 'function') {
        throw new Error('ReactIntersectionObserver: `Config.errorReporter` must be a callable');
      }

      config.errorReporter = value;
    }
  }
});