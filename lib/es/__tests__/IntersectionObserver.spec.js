function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-env jest */
import 'intersection-observer';
import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import IntersectionObserver, { getOptions } from '../IntersectionObserver';
import { callback, observerElementsMap } from '../observer';
import Config from '../config';
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

var propTypes = IntersectionObserver.propTypes;

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
}(Component);

var disablePropTypes = function disablePropTypes() {
  IntersectionObserver.propTypes = {};
};

var enablePropTypes = function enablePropTypes() {
  IntersectionObserver.propTypes = propTypes;
};

afterEach(function () {
  observerElementsMap.clear();
});
test('throws when the property children is not an only child', function () {
  global.spyOn(console, 'error');
  expect(function () {
    return renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement("span", null), React.createElement("span", null)));
  }).toThrowErrorMatchingInlineSnapshot("\"React.Children.only expected to receive a single React element child.\"");
});
test('throws trying to observe children without a DOM node', function () {
  global.spyOn(console, 'error'); // suppress error boundary warning

  var sizeBeforeObserving = observerElementsMap.size;
  expect(function () {
    return renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement(ProxyComponent, null, null)));
  }).toThrowErrorMatchingInlineSnapshot("\"ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree.\"");
  expect(observerElementsMap.size).toBe(sizeBeforeObserving);
});
test('should not observe children that equal null or undefined', function () {
  var sizeBeforeObserving = observerElementsMap.size;
  renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, undefined));
  expect(observerElementsMap.size).toBe(sizeBeforeObserving);
});
test('should not reobserve children that equal null or undefined', function () {
  var tree = renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, undefined));
  var instance = tree.getInstance();
  var observe = jest.spyOn(instance, 'observe');
  var unobserve = jest.spyOn(instance, 'unobserve');
  tree.update(React.createElement(IntersectionObserver, {
    onChange: noop
  }, null));
  tree.update(React.createElement(IntersectionObserver, {
    onChange: noop,
    rootMargin: "1%"
  }, null));
  expect(unobserve).not.toBeCalled();
  expect(observe).toBeCalledTimes(1);
  expect(observe).toReturnWith(false);
});
test('should reobserve null children updating to a DOM node', function () {
  var tree = renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, null), {
    createNodeMock: createNodeMock
  });
  var instance = tree.getInstance();
  var observe = jest.spyOn(instance, 'observe');
  var unobserve = jest.spyOn(instance, 'unobserve');
  tree.update(React.createElement(IntersectionObserver, {
    onChange: noop
  }, React.createElement("div", null)));
  expect(observe).toBeCalledTimes(1);
  expect(observe).toReturnWith(true);
  expect(unobserve).not.toBeCalled();
});
test('should unobserve children updating to null', function () {
  var tree = renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, React.createElement("div", null)), {
    createNodeMock: createNodeMock
  });
  var instance = tree.getInstance();
  var observe = jest.spyOn(instance, 'observe');
  var unobserve = jest.spyOn(instance, 'unobserve');
  tree.update(React.createElement(IntersectionObserver, {
    onChange: noop
  }, null));
  expect(unobserve).toBeCalledTimes(1);
  expect(observe).toReturnWith(false);
});
test('should call ref callback of children with target', function () {
  var spy = jest.fn();
  renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, React.createElement("span", {
    ref: spy
  })), {
    createNodeMock: createNodeMock
  });
  expect(spy).toBeCalledWith(target);
});
test('should handle children ref of type RefObject', function () {
  var ref = React.createRef();
  renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, React.createElement("span", {
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
  var tree = renderer.create(React.createElement(IntersectionObserver, Object.assign({
    onChange: noop
  }, options), React.createElement("span", null)), {
    createNodeMock: createNodeMock
  });
  expect(getOptions(tree.getInstance().props)).toEqual(options);
  enablePropTypes();
});
test('should observe target on mount', function () {
  var sizeAfterObserving = observerElementsMap.size + 1;
  renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, React.createElement("span", null)), {
    createNodeMock: createNodeMock
  });
  expect(sizeAfterObserving).toBe(observerElementsMap.size);
});
test('should unobserve target on unmount', function () {
  var sizeBeforeObserving = observerElementsMap.size;
  var tree = renderer.create(React.createElement(IntersectionObserver, {
    onChange: noop
  }, React.createElement("span", null)), {
    createNodeMock: createNodeMock
  });
  tree.unmount();
  expect(sizeBeforeObserving).toBe(observerElementsMap.size);
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
    var tree = renderer.create(React.createElement(IntersectionObserver, initialProps, React.createElement("span", null)), {
      createNodeMock: createNodeMock
    });
    var instance = tree.getInstance();
    var unobserve = jest.spyOn(instance, 'unobserve');
    var observe = jest.spyOn(instance, 'observe'); // none of the props updating [0/0]

    tree.update(React.createElement(IntersectionObserver, initialProps, React.createElement("span", null))); // only children updating [1/1]

    tree.update(React.createElement(IntersectionObserver, initialProps, React.createElement("div", null))); // DOM node not updating [1/1]

    tree.update(React.createElement(IntersectionObserver, initialProps, React.createElement("div", {
      key: "forcesRender"
    }))); // only root updating (document) [2/2]

    tree.update(React.createElement(IntersectionObserver, Object.assign({}, initialProps, {
      root: root2
    }), React.createElement("div", null))); // only root updating (window) [3/3]

    tree.update(React.createElement(IntersectionObserver, Object.assign({}, initialProps, {
      root: root1
    }), React.createElement("div", null))); // only rootMargin updating [4/4]

    tree.update(React.createElement(IntersectionObserver, Object.assign({}, initialProps, {
      root: root1,
      rootMargin: "20% 10%"
    }), React.createElement("div", null))); // only threshold updating (non-scalar) [5/5]

    tree.update(React.createElement(IntersectionObserver, Object.assign({}, initialProps, {
      threshold: [0.5, 1]
    }), React.createElement("div", null))); // only threshold updating (length changed) [6/6]

    tree.update(React.createElement(IntersectionObserver, Object.assign({}, initialProps, {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }), React.createElement("div", null))); // only threshold updating (scalar) [7/7]

    tree.update(React.createElement(IntersectionObserver, Object.assign({}, initialProps, {
      threshold: 1
    }), React.createElement("div", null))); // both props and children updating [8/8]

    tree.update(React.createElement(IntersectionObserver, initialProps, React.createElement("span", null))); // sanity check: nothing else updates [8/8]

    tree.update(React.createElement(IntersectionObserver, initialProps, React.createElement("span", null)));
    expect(unobserve).toBeCalledTimes(8);
    expect(observe).toReturnTimes(8);
    expect(observe).toReturnWith(true);
    enablePropTypes();
  });
  test('should throw when updating without a DOM Node', function () {
    global.spyOn(console, 'error'); // suppress error boundary warning

    var tree = renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement(ProxyComponent, null, React.createElement("div", null))), {
      createNodeMock: createNodeMock
    });
    var instance = tree.getInstance();
    var observe = jest.spyOn(instance, 'observe');
    var unobserve = jest.spyOn(instance, 'unobserve');
    expect(function () {
      return tree.update(React.createElement(IntersectionObserver, {
        onChange: noop
      }, React.createElement(ProxyComponent, {
        key: "forcesRender"
      }, null)));
    }).toThrowErrorMatchingInlineSnapshot("\"ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree.\"");
    expect(unobserve).toBeCalledTimes(1);
    expect(observe).toBeCalledTimes(1);
  });
  test('should call a setup errorReporter without a DOM Node', function () {
    var spy = jest.fn();
    var origErrorReporter = Config.errorReporter;
    Config.errorReporter = spy;
    var tree = renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement(ProxyComponent, null, React.createElement("div", null))), {
      createNodeMock: createNodeMock
    });
    var instance = tree.getInstance();
    var observe = jest.spyOn(instance, 'observe');
    var unobserve = jest.spyOn(instance, 'unobserve');
    tree.update(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement(ProxyComponent, {
      key: "forcesRender"
    }, null)));
    expect(spy).toBeCalled();
    expect(unobserve).toBeCalledTimes(1);
    expect(observe).toBeCalledTimes(1);
    expect(observe).toReturnWith(false);
    Config.errorReporter = origErrorReporter;
  });
  test('should observe when updating with a DOM Node', function () {
    global.spyOn(console, 'error'); // suppress error boundary warning

    var sizeAfterUnobserving = observerElementsMap.size;
    var sizeAfterObserving = observerElementsMap.size + 1;
    var tree = renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement(ProxyComponent, null, React.createElement("div", null))), {
      createNodeMock: createNodeMock
    });
    var instance = tree.getInstance();
    var unobserve = jest.spyOn(instance, 'unobserve');
    expect(function () {
      tree.update(React.createElement(IntersectionObserver, {
        onChange: noop
      }, React.createElement(ProxyComponent, {
        key: "forcesRender"
      }, null)));
    }).toThrow();
    expect(unobserve).toBeCalledTimes(1);
    expect(sizeAfterUnobserving).toBe(observerElementsMap.size);
    tree.update(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement(ProxyComponent, null, React.createElement("div", null))));
    expect(sizeAfterObserving).toBe(observerElementsMap.size);
  });
});
describe('onChange', function () {
  var boundingClientRect = {};
  var intersectionRect = {};
  test('should invoke a callback for each observer entry', function () {
    var onChange = jest.fn();
    var component = React.createElement(IntersectionObserver, {
      onChange: onChange
    }, React.createElement("span", null));
    var instance1 = renderer.create(component, {
      createNodeMock: function createNodeMock() {
        return targets.div;
      }
    }).getInstance();
    var instance2 = renderer.create(React.cloneElement(component), {
      createNodeMock: createNodeMock
    }).getInstance();
    expect(observerElementsMap.size).toBe(1);
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
    callback([entry1, entry2], instance1.observer);
    expect(onChange).toHaveBeenNthCalledWith(1, entry1, instance1.externalUnobserve);
    expect(onChange).toHaveBeenNthCalledWith(2, entry2, instance2.externalUnobserve);
  });
  test('unobserve using the second argument from onChange', function () {
    var sizeAfterObserving = observerElementsMap.size + 1;
    var sizeAfterUnobserving = observerElementsMap.size;

    var onChange = function onChange(_, unobserve) {
      unobserve();
    };

    var instance = renderer.create(React.createElement(IntersectionObserver, {
      onChange: onChange
    }, React.createElement("span", null)), {
      createNodeMock: createNodeMock
    }).getInstance();
    expect(sizeAfterObserving).toBe(observerElementsMap.size);
    callback([new IntersectionObserverEntry({
      target: target,
      boundingClientRect: boundingClientRect,
      intersectionRect: intersectionRect
    })], instance.observer);
    expect(sizeAfterUnobserving).toBe(observerElementsMap.size);
  });
});
describe('disabled', function () {
  test('should not observe if disabled', function () {
    var sizeBeforeObserving = observerElementsMap.size;
    renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop,
      disabled: true
    }, React.createElement("span", null)), {
      createNodeMock: createNodeMock
    });
    expect(observerElementsMap.size).toBe(sizeBeforeObserving);
  });
  test('should observe if no longer disabled', function () {
    var tree = renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop,
      disabled: true
    }, React.createElement("span", null)), {
      createNodeMock: createNodeMock
    });
    var instance = tree.getInstance();
    var observe = jest.spyOn(instance, 'observe');
    var unobserve = jest.spyOn(instance, 'unobserve');
    tree.update(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement("span", null)));
    expect(unobserve).not.toBeCalled();
    expect(observe).toReturnWith(true);
  });
  test('should unobserve if disabled', function () {
    var tree = renderer.create(React.createElement(IntersectionObserver, {
      onChange: noop
    }, React.createElement("span", null)), {
      createNodeMock: createNodeMock
    });
    var instance = tree.getInstance();
    var unobserve = jest.spyOn(instance, 'unobserve');
    var observe = jest.spyOn(instance, 'observe');
    tree.update(React.createElement(IntersectionObserver, {
      onChange: noop,
      disabled: true
    }, React.createElement("span", null)));
    expect(unobserve).toBeCalled();
    expect(observe).toReturnWith(false);
  });
});