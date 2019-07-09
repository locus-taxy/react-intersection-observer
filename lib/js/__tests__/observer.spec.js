"use strict";

require("intersection-observer");

var _observer = require("../observer");

/* eslint-env jest */
var IntersectionObserver = window.IntersectionObserver;
var defaultOptions = {
  rootMargin: '-10% 0%',
  threshold: [0, 0.5, 1]
};

var noop = function noop() {};

var target1 = {
  nodeType: 1,
  id: 1
};
var target2 = {
  nodeType: 1,
  id: 2
};
afterEach(function () {
  _observer.observerElementsMap.clear();
});
test('createObserver creates a new IntersectionObserver instance', function () {
  window.IntersectionObserver = jest.fn();
  var observer = (0, _observer.createObserver)(defaultOptions);
  var mockInstance = window.IntersectionObserver.mock.instances[0];
  expect(mockInstance).toBeInstanceOf(window.IntersectionObserver);
  expect(observer).toEqual(mockInstance);
  window.IntersectionObserver = IntersectionObserver;
});
describe('getPooled', function () {
  var instance;
  beforeEach(function () {
    instance = new IntersectionObserver(noop, defaultOptions);

    _observer.observerElementsMap.set(instance);
  });
  test('returns nothing given options did not match', function () {
    expect((0, _observer.getPooled)()).toBeNull();
    expect((0, _observer.getPooled)({
      rootMargin: '-20% 0%',
      threshold: 1
    })).toBeNull();
    expect((0, _observer.getPooled)({
      rootMargin: '-10% 0%',
      threshold: 0
    })).toBeNull();
    expect((0, _observer.getPooled)({
      threshold: 0.5
    })).toBeNull();
  });
  test('returns nothing given threshold did not match', function () {
    expect((0, _observer.getPooled)({
      rootMargin: '-10% 0%',
      threshold: [0, 0.5, 1, 0.25]
    })).toBeNull();
    expect((0, _observer.getPooled)({
      rootMargin: '-10% 0%',
      threshold: [1, 0.5, 0]
    })).toBeNull();
  });
  test('throws if rootMargin cannot be parsed', function () {
    expect(function () {
      return (0, _observer.getPooled)({
        rootMargin: '-10% 0',
        threshold: 0
      });
    }).toThrowErrorMatchingInlineSnapshot("\"rootMargin must be a string literal containing pixels and/or percent values\"");
  });
  test('retrieves an existing IntersectionObserver instance given all options match', function () {
    expect((0, _observer.getPooled)(defaultOptions)).toEqual(instance);
  });
  test('createObserver returns a pooled IntersectionObserver instance', function () {
    var observer = (0, _observer.createObserver)(defaultOptions);
    expect(observer).toEqual((0, _observer.getPooled)(defaultOptions));
  });
});
describe('observeElement', function () {
  test('observing a React instance when observer is already in observerElementsMap', function () {
    var observer = (0, _observer.createObserver)(defaultOptions);
    var spy = jest.spyOn(observer, 'observe');
    var targets = new Set();

    _observer.observerElementsMap.set(observer, targets);

    var element = {
      observer: observer,
      target: target1
    };
    (0, _observer.observeElement)(element);
    expect(Array.from(targets)[0]).toEqual(element);
    expect(spy).toBeCalled();
  });
  test('observing a React instance when observer is not in observerElementsMap yet', function () {
    var observer = (0, _observer.createObserver)(defaultOptions);
    var spy = jest.spyOn(observer, 'observe');
    var element = {
      observer: observer,
      target: target2
    };
    (0, _observer.observeElement)(element);
    var targets = Array.from(_observer.observerElementsMap.get(observer));
    expect(targets[0]).toEqual(element);
    expect(spy).toBeCalled();
  });
});
describe('unobserveElement', function () {
  test('unobserving a React instance while instance still in use by other observables', function () {
    var observer = (0, _observer.createObserver)(defaultOptions);
    var spy = jest.spyOn(observer, 'unobserve');
    var element1 = {
      observer: observer,
      target: target1
    };
    var element2 = {
      observer: observer,
      target: target2
    };
    (0, _observer.observeElement)(element1);
    (0, _observer.observeElement)(element2);
    (0, _observer.unobserveElement)(element1, target1);
    expect(_observer.observerElementsMap.has(observer)).toBeTruthy();
    expect(spy.mock.calls[0][0]).toEqual(target1);
  });
  test('unobserving a React instance while instance is not in use anymore', function () {
    var observer = (0, _observer.createObserver)(defaultOptions);
    var spy = jest.spyOn(observer, 'disconnect');
    var element = {
      observer: observer,
      target: target1
    };
    (0, _observer.observeElement)(element);
    (0, _observer.unobserveElement)(element, target1);
    expect(_observer.observerElementsMap.has(observer)).toBeFalsy();
    expect(spy).toBeCalled();
  });
});
describe('findObserverElement', function () {
  test('given an entry and no observer returns null', function () {
    var observer = (0, _observer.createObserver)();
    var entry = {
      observer: observer,
      target: target1
    };
    (0, _observer.observeElement)(entry);
    var instance = (0, _observer.findObserverElement)(null, entry);
    expect(instance).toBeNull();
  });
  test('given an entry without target property throws', function () {
    (0, _observer.createObserver)();
    expect(function () {
      return (0, _observer.observeElement)({});
    }).toThrowErrorMatchingInlineSnapshot("\"Cannot read property 'observe' of undefined\"");
  });
  test('an entry matches the observer - single observer instance', function () {
    var observer = (0, _observer.createObserver)();
    var entry = {
      observer: observer,
      target: target1
    };
    (0, _observer.observeElement)(entry, target1);
    var instance = (0, _observer.findObserverElement)(observer, entry);
    expect(instance).toEqual(entry);
  });
  test('an entry matches the observer - multiple observer instances', function () {
    var observer1 = (0, _observer.createObserver)();
    var observer2 = (0, _observer.createObserver)(defaultOptions);
    var entry1 = {
      observer: observer1,
      target: target1
    };
    var entry2 = {
      observer: observer2,
      target: target1
    };
    (0, _observer.observeElement)(entry1);
    (0, _observer.observeElement)(entry2);
    var instance1 = (0, _observer.findObserverElement)(observer1, entry1);
    var instance2 = (0, _observer.findObserverElement)(observer2, entry2);
    expect(instance1).toEqual(entry1);
    expect(instance2).toEqual(entry2);
  });
  test('multiple entries match one observer', function () {
    var observer = (0, _observer.createObserver)();
    var entry1 = {
      observer: observer,
      target: target1
    };
    var entry2 = {
      observer: observer,
      target: target2
    };
    (0, _observer.observeElement)(entry1);
    (0, _observer.observeElement)(entry2);
    var instance1 = (0, _observer.findObserverElement)(observer, entry1);
    var instance2 = (0, _observer.findObserverElement)(observer, entry2);
    expect(instance1).toEqual(entry1);
    expect(instance2).toEqual(entry2);
  });
  test('multiple entries match multiple observers', function () {
    var observer1 = (0, _observer.createObserver)();
    var observer2 = (0, _observer.createObserver)(defaultOptions);
    var entry1 = {
      observer: observer1,
      target: target1
    };
    var entry2 = {
      observer: observer2,
      target: target2
    };
    (0, _observer.observeElement)(entry1);
    (0, _observer.observeElement)(entry2);
    var instance1 = (0, _observer.findObserverElement)(observer1, entry1);
    var instance2 = (0, _observer.findObserverElement)(observer2, entry2);
    expect(instance1).toEqual(entry1);
    expect(instance2).toEqual(entry2);
  });
});