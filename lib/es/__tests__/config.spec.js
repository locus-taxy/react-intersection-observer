/* eslint-env jest */
import Config from '../config';
import invariant from 'invariant';
jest.mock('invariant', function () {
  return jest.fn();
});
describe('Config', function () {
  var testErrorReporter = jest.fn();
  var errorMsg = 'Intentionally throw exception';
  test('default errorReporter', function () {
    Config.errorReporter(errorMsg);
    expect(invariant).toBeCalledWith(false, errorMsg);
  });
  test('custom errorReporter', function () {
    var defaultTestErrorReporter = Config.errorReporter;
    Config.errorReporter = testErrorReporter;
    Config.errorReporter(errorMsg);
    expect(testErrorReporter).toBeCalledWith(errorMsg);
    Config.errorReporter = defaultTestErrorReporter;
  });
  test('custom non-callable errorReporter', function () {
    expect(function () {
      Config.errorReporter = 'fail';
    }).toThrowErrorMatchingInlineSnapshot("\"ReactIntersectionObserver: `Config.errorReporter` must be a callable\"");
  });
});