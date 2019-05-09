"use strict";

var _config = _interopRequireDefault(require("../config"));

var _invariant = _interopRequireDefault(require("invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
jest.mock('invariant', function () {
  return jest.fn();
});
describe('Config', function () {
  var testErrorReporter = jest.fn();
  var errorMsg = 'Intentionally throw exception';
  test('default errorReporter', function () {
    _config.default.errorReporter(errorMsg);

    expect(_invariant.default).toBeCalledWith(false, errorMsg);
  });
  test('custom errorReporter', function () {
    var defaultTestErrorReporter = _config.default.errorReporter;
    _config.default.errorReporter = testErrorReporter;

    _config.default.errorReporter(errorMsg);

    expect(testErrorReporter).toBeCalledWith(errorMsg);
    _config.default.errorReporter = defaultTestErrorReporter;
  });
  test('custom non-callable errorReporter', function () {
    expect(function () {
      _config.default.errorReporter = 'fail';
    }).toThrowErrorMatchingInlineSnapshot("\"ReactIntersectionObserver: `Config.errorReporter` must be a callable\"");
  });
});