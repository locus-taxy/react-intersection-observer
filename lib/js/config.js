"use strict";

exports.__esModule = true;
exports.default = void 0;

var _invariant = _interopRequireDefault(require("invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {};

var _default = Object.create(null, {
  errorReporter: {
    configurable: false,
    get: function get() {
      return config.errorReporter || function (format) {
        return (0, _invariant.default)(false, format);
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

exports.default = _default;