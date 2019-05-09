"use strict";

exports.__esModule = true;
exports.getPooled = getPooled;
exports.findObserverElement = findObserverElement;
exports.callback = callback;
exports.createObserver = createObserver;
exports.observeElement = observeElement;
exports.unobserveElement = unobserveElement;
exports.observerElementsMap = void 0;

var _utils = require("./utils");

var observerElementsMap = new Map();
exports.observerElementsMap = observerElementsMap;

function getPooled(options) {
  if (options === void 0) {
    options = {};
  }

  var root = options.root || null;
  var rootMargin = (0, _utils.parseRootMargin)(options.rootMargin);
  var threshold = Array.isArray(options.threshold) ? options.threshold : [options.threshold != null ? options.threshold : 0];
  var observers = observerElementsMap.keys();
  var observer;

  while (observer = observers.next().value) {
    var unmatched = root !== observer.root || rootMargin !== observer.rootMargin || (0, _utils.shallowCompare)(threshold, observer.thresholds);

    if (!unmatched) {
      return observer;
    }
  }

  return null;
}

function findObserverElement(observer, entry) {
  var elements = observerElementsMap.get(observer);

  if (elements) {
    var values = elements.values();
    var element;

    while (element = values.next().value) {
      if (element.target === entry.target) {
        return element;
      }
    }
  }

  return null;
}
/**
 * The Intersection Observer API callback that is called whenever one element
 * – namely the target – intersects either the device viewport or a specified element.
 * Also will get called whenever the visibility of the target element changes and
 * crosses desired amounts of intersection with the root.
 * @param {array} changes
 * @param {IntersectionObserver} observer
 */


function callback(changes, observer) {
  for (var i = 0; i < changes.length; i++) {
    var element = findObserverElement(observer, changes[i]);

    if (element) {
      element.handleChange(changes[i]);
    }
  }
}

function createObserver(options) {
  return getPooled(options) || new IntersectionObserver(callback, options);
}

function observeElement(element) {
  if (!observerElementsMap.has(element.observer)) {
    observerElementsMap.set(element.observer, new Set());
  }

  observerElementsMap.get(element.observer).add(element);
  element.observer.observe(element.target);
}

function unobserveElement(element, target) {
  if (observerElementsMap.has(element.observer)) {
    var targets = observerElementsMap.get(element.observer);

    if (targets.delete(element)) {
      if (targets.size > 0) {
        element.observer.unobserve(target);
      } else {
        element.observer.disconnect();
        observerElementsMap.delete(element.observer);
      }
    }
  }
}