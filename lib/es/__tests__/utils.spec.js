function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-env jest */
import { parseRootMargin, shallowCompare } from '../utils';
describe('parseRootMargin', function () {
  test('throws when using wrong units', function () {
    expect(function () {
      return parseRootMargin('10');
    }).toThrowErrorMatchingInlineSnapshot("\"rootMargin must be a string literal containing pixels and/or percent values\"");
    expect(function () {
      return parseRootMargin('10% 10');
    }).toThrowErrorMatchingInlineSnapshot("\"rootMargin must be a string literal containing pixels and/or percent values\"");
  });
  test('returns rootMargins with all four values', function () {
    expect(parseRootMargin()).toBe('0px 0px 0px 0px');
    expect(parseRootMargin(null)).toBe('0px 0px 0px 0px');
    expect(parseRootMargin('')).toBe('0px 0px 0px 0px');
    expect(parseRootMargin('10px 5px 0%')).toBe('10px 5px 0% 5px');
    expect(parseRootMargin('10px  ')).toBe('10px 10px 10px 10px');
    expect(parseRootMargin(' 10px 5px')).toBe('10px 5px 10px 5px');
    expect(parseRootMargin('10px 5px  0% 1%')).toBe('10px 5px 0% 1%');
  });
});
describe('shallowCompare', function () {
  var comparerFn = function comparerFn(nextProps, prevProps) {
    return ['disabled', 'root', 'rootMargin', 'threshold'].some(function (option) {
      return shallowCompare(nextProps[option], prevProps[option]);
    });
  };

  test('should return true if threshold array length is not the same', function () {
    var nextProps = {
      threshold: [0.25, 0.5]
    };
    var prevProps = {
      threshold: [0.25, 0.5, 0.75]
    };
    expect(comparerFn(nextProps, prevProps)).toBeTruthy();
  });
  test('should return true if threshold array length is the same but not equal', function () {
    var nextProps = {
      threshold: [0.25, 0.75, 0.5]
    };
    var prevProps = {
      threshold: [0.25, 0.5, 0.75]
    };
    expect(comparerFn(nextProps, prevProps)).toBeTruthy();
  });
  test('should return false if options are equal', function () {
    var nextProps = {
      disabled: true,
      root: 1,
      rootMargin: 2,
      threshold: [0.25, 0.75, 0.5]
    };

    var prevProps = _objectSpread({}, nextProps);

    expect(comparerFn(nextProps, prevProps)).toBeFalsy();
  });
  test('should return true if options are different', function () {
    var nextProps = {
      disabled: true,
      root: 1,
      rootMargin: 2,
      threshold: [0.25, 0.75, 0.5]
    };

    var prevProps = _objectSpread({}, nextProps, {
      threshold: 1
    });

    expect(comparerFn(nextProps, prevProps)).toBeTruthy();
  });
});