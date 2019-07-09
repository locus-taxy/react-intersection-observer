"use strict";

require("intersection-observer");

var _react = _interopRequireWildcard(require("react"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _IntersectionObserver = _interopRequireWildcard(require("../IntersectionObserver"));

var _observer = require("../observer");

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

jest.mock('react-dom', function () {
  var _jest$requireActual = jest.requireActual('react-dom'),
      _findDOMNode = _jest$requireActual.findDOMNode;

  var target = {
    nodeType: 1,
    type: 'noscript'
  };
  return {
    findDOMNode: function findDOMNode(x) {
      var found = _findDOMNode(x);

      if (found == null) {
        return found;
      }

      return typeof x.type === 'string' ? found : target;
    }
  };
});
var target = {
  nodeType: 1,
  type: 'span'
};
var targets = {
  div: {
    nodeType: 1,
    type: 'div'
  },
  span: target
};

var createNodeMock = function createNodeMock(_ref) {
  var type = _ref.type;
  return targets[type];
};

var noop = function noop() {};

var propTypes = _IntersectionObserver.default.propTypes;

var ProxyComponent =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(ProxyComponent, _Component);

  function ProxyComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ProxyComponent.prototype;

  _proto.render = function render() {
    return this.props.children; // eslint-disable-line react/prop-types
  };

  return ProxyComponent;
}(_react.Component);

var disablePropTypes = function disablePropTypes() {
  _IntersectionObserver.default.propTypes = {};
};

var enablePropTypes = function enablePropTypes() {
  _IntersectionObserver.default.propTypes = propTypes;
};

afterEach(function () {
  _observer.observerElementsMap.clear();
});
test('throws when the property children is not an only child', function () {
  global.spyOn(console, 'error');
  expect(function () {
    return _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement("span", null), _react.default.createElement("span", null)));
  }).toThrowErrorMatchingInlineSnapshot("\"React.Children.only expected to receive a single React element child.\"");
});
test('throws trying to observe children without a DOM node', function () {
  global.spyOn(console, 'error'); // suppress error boundary warning

  var sizeBeforeObserving = _observer.observerElementsMap.size;
  expect(function () {
    return _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement(ProxyComponent, null, null)));
  }).toThrowErrorMatchingInlineSnapshot("\"ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree.\"");
  expect(_observer.observerElementsMap.size).toBe(sizeBeforeObserving);
});
test('should not observe children that equal null or undefined', function () {
  var sizeBeforeObserving = _observer.observerElementsMap.size;

  _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, undefined));

  expect(_observer.observerElementsMap.size).toBe(sizeBeforeObserving);
});
test('should not reobserve children that equal null or undefined', function () {
  var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, undefined));

  var instance = tree.getInstance();
  var observe = jest.spyOn(instance, 'observe');
  var unobserve = jest.spyOn(instance, 'unobserve');
  tree.update(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, null));
  tree.update(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop,
    rootMargin: "1%"
  }, null));
  expect(unobserve).not.toBeCalled();
  expect(observe).toBeCalledTimes(1);
  expect(observe).toReturnWith(false);
});
test('should reobserve null children updating to a DOM node', function () {
  var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, null), {
    createNodeMock: createNodeMock
  });

  var instance = tree.getInstance();
  var observe = jest.spyOn(instance, 'observe');
  var unobserve = jest.spyOn(instance, 'unobserve');
  tree.update(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, _react.default.createElement("div", null)));
  expect(observe).toBeCalledTimes(1);
  expect(observe).toReturnWith(true);
  expect(unobserve).not.toBeCalled();
});
test('should unobserve children updating to null', function () {
  var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, _react.default.createElement("div", null)), {
    createNodeMock: createNodeMock
  });

  var instance = tree.getInstance();
  var observe = jest.spyOn(instance, 'observe');
  var unobserve = jest.spyOn(instance, 'unobserve');
  tree.update(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, null));
  expect(unobserve).toBeCalledTimes(1);
  expect(observe).toReturnWith(false);
});
test('should call ref callback of children with target', function () {
  var spy = jest.fn();

  _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, _react.default.createElement("span", {
    ref: spy
  })), {
    createNodeMock: createNodeMock
  });

  expect(spy).toBeCalledWith(target);
});
test('should handle children ref of type RefObject', function () {
  var ref = _react.default.createRef();

  _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, _react.default.createElement("span", {
    ref: ref
  })), {
    createNodeMock: createNodeMock
  });

  expect(ref.current).toEqual(target);
});
test('getOptions returns props `root`, `rootMargin` and `threshold`', function () {
  disablePropTypes();
  var options = {
    root: {
      nodeType: 1
    },
    rootMargin: '50% 0%',
    threshold: [0, 1]
  };

  var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, Object.assign({
    onChange: noop
  }, options), _react.default.createElement("span", null)), {
    createNodeMock: createNodeMock
  });

  expect((0, _IntersectionObserver.getOptions)(tree.getInstance().props)).toEqual(options);
  enablePropTypes();
});
test('should observe target on mount', function () {
  var sizeAfterObserving = _observer.observerElementsMap.size + 1;

  _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, _react.default.createElement("span", null)), {
    createNodeMock: createNodeMock
  });

  expect(sizeAfterObserving).toBe(_observer.observerElementsMap.size);
});
test('should unobserve target on unmount', function () {
  var sizeBeforeObserving = _observer.observerElementsMap.size;

  var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
    onChange: noop
  }, _react.default.createElement("span", null)), {
    createNodeMock: createNodeMock
  });

  tree.unmount();
  expect(sizeBeforeObserving).toBe(_observer.observerElementsMap.size);
});
describe('updating', function () {
  test('should reobserve with new root, rootMargin and/or threshold props', function () {
    disablePropTypes();
    var root1 = {
      id: 'window',
      nodeType: 1
    };
    var root2 = {
      id: 'document',
      nodeType: 1
    };
    var initialProps = {
      onChange: noop,
      root: root1,
      rootMargin: '10% 20%',
      threshold: 0.5
    };

    var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, initialProps, _react.default.createElement("span", null)), {
      createNodeMock: createNodeMock
    });

    var instance = tree.getInstance();
    var unobserve = jest.spyOn(instance, 'unobserve');
    var observe = jest.spyOn(instance, 'observe'); // none of the props updating [0/0]

    tree.update(_react.default.createElement(_IntersectionObserver.default, initialProps, _react.default.createElement("span", null))); // only children updating [1/1]

    tree.update(_react.default.createElement(_IntersectionObserver.default, initialProps, _react.default.createElement("div", null))); // DOM node not updating [1/1]

    tree.update(_react.default.createElement(_IntersectionObserver.default, initialProps, _react.default.createElement("div", {
      key: "forcesRender"
    }))); // only root updating (document) [2/2]

    tree.update(_react.default.createElement(_IntersectionObserver.default, Object.assign({}, initialProps, {
      root: root2
    }), _react.default.createElement("div", null))); // only root updating (window) [3/3]

    tree.update(_react.default.createElement(_IntersectionObserver.default, Object.assign({}, initialProps, {
      root: root1
    }), _react.default.createElement("div", null))); // only rootMargin updating [4/4]

    tree.update(_react.default.createElement(_IntersectionObserver.default, Object.assign({}, initialProps, {
      root: root1,
      rootMargin: "20% 10%"
    }), _react.default.createElement("div", null))); // only threshold updating (non-scalar) [5/5]

    tree.update(_react.default.createElement(_IntersectionObserver.default, Object.assign({}, initialProps, {
      threshold: [0.5, 1]
    }), _react.default.createElement("div", null))); // only threshold updating (length changed) [6/6]

    tree.update(_react.default.createElement(_IntersectionObserver.default, Object.assign({}, initialProps, {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }), _react.default.createElement("div", null))); // only threshold updating (scalar) [7/7]

    tree.update(_react.default.createElement(_IntersectionObserver.default, Object.assign({}, initialProps, {
      threshold: 1
    }), _react.default.createElement("div", null))); // both props and children updating [8/8]

    tree.update(_react.default.createElement(_IntersectionObserver.default, initialProps, _react.default.createElement("span", null))); // sanity check: nothing else updates [8/8]

    tree.update(_react.default.createElement(_IntersectionObserver.default, initialProps, _react.default.createElement("span", null)));
    expect(unobserve).toBeCalledTimes(8);
    expect(observe).toReturnTimes(8);
    expect(observe).toReturnWith(true);
    enablePropTypes();
  });
  test('should throw when updating without a DOM Node', function () {
    global.spyOn(console, 'error'); // suppress error boundary warning

    var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement(ProxyComponent, null, _react.default.createElement("div", null))), {
      createNodeMock: createNodeMock
    });

    var instance = tree.getInstance();
    var observe = jest.spyOn(instance, 'observe');
    var unobserve = jest.spyOn(instance, 'unobserve');
    expect(function () {
      return tree.update(_react.default.createElement(_IntersectionObserver.default, {
        onChange: noop
      }, _react.default.createElement(ProxyComponent, {
        key: "forcesRender"
      }, null)));
    }).toThrowErrorMatchingInlineSnapshot("\"ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree.\"");
    expect(unobserve).toBeCalledTimes(1);
    expect(observe).toBeCalledTimes(1);
  });
  test('should call a setup errorReporter without a DOM Node', function () {
    var spy = jest.fn();
    var origErrorReporter = _config.default.errorReporter;
    _config.default.errorReporter = spy;

    var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement(ProxyComponent, null, _react.default.createElement("div", null))), {
      createNodeMock: createNodeMock
    });

    var instance = tree.getInstance();
    var observe = jest.spyOn(instance, 'observe');
    var unobserve = jest.spyOn(instance, 'unobserve');
    tree.update(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement(ProxyComponent, {
      key: "forcesRender"
    }, null)));
    expect(spy).toBeCalled();
    expect(unobserve).toBeCalledTimes(1);
    expect(observe).toBeCalledTimes(1);
    expect(observe).toReturnWith(false);
    _config.default.errorReporter = origErrorReporter;
  });
  test('should observe when updating with a DOM Node', function () {
    global.spyOn(console, 'error'); // suppress error boundary warning

    var sizeAfterUnobserving = _observer.observerElementsMap.size;
    var sizeAfterObserving = _observer.observerElementsMap.size + 1;

    var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement(ProxyComponent, null, _react.default.createElement("div", null))), {
      createNodeMock: createNodeMock
    });

    var instance = tree.getInstance();
    var unobserve = jest.spyOn(instance, 'unobserve');
    expect(function () {
      tree.update(_react.default.createElement(_IntersectionObserver.default, {
        onChange: noop
      }, _react.default.createElement(ProxyComponent, {
        key: "forcesRender"
      }, null)));
    }).toThrow();
    expect(unobserve).toBeCalledTimes(1);
    expect(sizeAfterUnobserving).toBe(_observer.observerElementsMap.size);
    tree.update(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement(ProxyComponent, null, _react.default.createElement("div", null))));
    expect(sizeAfterObserving).toBe(_observer.observerElementsMap.size);
  });
});
describe('onChange', function () {
  var boundingClientRect = {};
  var intersectionRect = {};
  test('should invoke a callback for each observer entry', function () {
    var onChange = jest.fn();

    var component = _react.default.createElement(_IntersectionObserver.default, {
      onChange: onChange
    }, _react.default.createElement("span", null));

    var instance1 = _reactTestRenderer.default.create(component, {
      createNodeMock: function createNodeMock() {
        return targets.div;
      }
    }).getInstance();

    var instance2 = _reactTestRenderer.default.create(_react.default.cloneElement(component), {
      createNodeMock: createNodeMock
    }).getInstance();

    expect(_observer.observerElementsMap.size).toBe(1);
    var entry1 = new IntersectionObserverEntry({
      target: targets.div,
      boundingClientRect: boundingClientRect,
      intersectionRect: intersectionRect
    });
    var entry2 = new IntersectionObserverEntry({
      target: target,
      boundingClientRect: boundingClientRect,
      intersectionRect: intersectionRect
    });
    (0, _observer.callback)([entry1, entry2], instance1.observer);
    expect(onChange).toHaveBeenNthCalledWith(1, entry1, instance1.externalUnobserve);
    expect(onChange).toHaveBeenNthCalledWith(2, entry2, instance2.externalUnobserve);
  });
  test('unobserve using the second argument from onChange', function () {
    var sizeAfterObserving = _observer.observerElementsMap.size + 1;
    var sizeAfterUnobserving = _observer.observerElementsMap.size;

    var onChange = function onChange(_, unobserve) {
      unobserve();
    };

    var instance = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: onChange
    }, _react.default.createElement("span", null)), {
      createNodeMock: createNodeMock
    }).getInstance();

    expect(sizeAfterObserving).toBe(_observer.observerElementsMap.size);
    (0, _observer.callback)([new IntersectionObserverEntry({
      target: target,
      boundingClientRect: boundingClientRect,
      intersectionRect: intersectionRect
    })], instance.observer);
    expect(sizeAfterUnobserving).toBe(_observer.observerElementsMap.size);
  });
});
describe('disabled', function () {
  test('should not observe if disabled', function () {
    var sizeBeforeObserving = _observer.observerElementsMap.size;

    _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop,
      disabled: true
    }, _react.default.createElement("span", null)), {
      createNodeMock: createNodeMock
    });

    expect(_observer.observerElementsMap.size).toBe(sizeBeforeObserving);
  });
  test('should observe if no longer disabled', function () {
    var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop,
      disabled: true
    }, _react.default.createElement("span", null)), {
      createNodeMock: createNodeMock
    });

    var instance = tree.getInstance();
    var observe = jest.spyOn(instance, 'observe');
    var unobserve = jest.spyOn(instance, 'unobserve');
    tree.update(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement("span", null)));
    expect(unobserve).not.toBeCalled();
    expect(observe).toReturnWith(true);
  });
  test('should unobserve if disabled', function () {
    var tree = _reactTestRenderer.default.create(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop
    }, _react.default.createElement("span", null)), {
      createNodeMock: createNodeMock
    });

    var instance = tree.getInstance();
    var unobserve = jest.spyOn(instance, 'unobserve');
    var observe = jest.spyOn(instance, 'observe');
    tree.update(_react.default.createElement(_IntersectionObserver.default, {
      onChange: noop,
      disabled: true
    }, _react.default.createElement("span", null)));
    expect(unobserve).toBeCalled();
    expect(observe).toReturnWith(false);
  });
});