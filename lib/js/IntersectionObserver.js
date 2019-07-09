"use strict";

exports.__esModule = true;
exports.getOptions = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _observer = require("./observer");

var _utils = require("./utils");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var observerOptions = ['root', 'rootMargin', 'threshold'];
var observableProps = ['root', 'rootMargin', 'threshold', 'disabled'];
var _Object$prototype = Object.prototype,
    hasOwnProperty = _Object$prototype.hasOwnProperty,
    toString = _Object$prototype.toString;

var getOptions = function getOptions(props) {
  return observerOptions.reduce(function (options, key) {
    if (hasOwnProperty.call(props, key)) {
      var rootIsString = key === 'root' && toString.call(props[key]) === '[object String]';
      options[key] = rootIsString ? document.querySelector(props[key]) : props[key];
    }

    return options;
  }, {});
};

exports.getOptions = getOptions;

var IntersectionObserver =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(IntersectionObserver, _React$Component);

  function IntersectionObserver() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleChange", function (event) {
      _this.props.onChange(event, _this.externalUnobserve);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleNode", function (target) {
      var children = _this.props.children;

      if (children != null) {
        /**
         * Forward hijacked ref to user.
         */
        var nodeRef = children.ref;

        if (nodeRef) {
          if (typeof nodeRef === 'function') {
            nodeRef(target);
          } else if (typeof nodeRef === 'object') {
            nodeRef.current = target;
          }
        }
      }

      _this.targetNode = target && (0, _reactDom.findDOMNode)(target);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "observe", function () {
      if (_this.props.children == null || _this.props.disabled) {
        return false;
      }

      if (!_this.targetNode) {
        _config.default.errorReporter("ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree.");

        return false;
      }

      _this.observer = (0, _observer.createObserver)(getOptions(_this.props));
      _this.target = _this.targetNode;
      (0, _observer.observeElement)(_assertThisInitialized(_assertThisInitialized(_this)));
      return true;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "unobserve", function (target) {
      (0, _observer.unobserveElement)(_assertThisInitialized(_assertThisInitialized(_this)), target);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "externalUnobserve", function () {
      _this.unobserve(_this.targetNode);
    });

    return _this;
  }

  var _proto = IntersectionObserver.prototype;

  _proto.getSnapshotBeforeUpdate = function getSnapshotBeforeUpdate(prevProps) {
    var _this2 = this;

    this.prevTargetNode = this.targetNode;
    var relatedPropsChanged = observableProps.some(function (prop) {
      return (0, _utils.shallowCompare)(_this2.props[prop], prevProps[prop]);
    });

    if (relatedPropsChanged) {
      if (this.prevTargetNode) {
        if (!prevProps.disabled) {
          this.unobserve(this.prevTargetNode);
        }
      }
    }

    return relatedPropsChanged;
  };

  _proto.componentDidUpdate = function componentDidUpdate(_, __, relatedPropsChanged) {
    var targetNodeChanged = false; // check if we didn't unobserve previously due to a prop change

    if (!relatedPropsChanged) {
      targetNodeChanged = this.prevTargetNode !== this.targetNode; // check we have a previous node we want to unobserve

      if (targetNodeChanged && this.prevTargetNode != null) {
        this.unobserve(this.prevTargetNode);
      }
    }

    if (relatedPropsChanged || targetNodeChanged) {
      this.observe();
    }
  };

  _proto.componentDidMount = function componentDidMount() {
    this.observe();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.targetNode) {
      this.unobserve(this.targetNode);
    }
  };

  _proto.render = function render() {
    var children = this.props.children;
    return children != null ? _react.default.cloneElement(_react.default.Children.only(children), {
      ref: this.handleNode
    }) : null;
  };

  return IntersectionObserver;
}(_react.default.Component);

exports.default = IntersectionObserver;

_defineProperty(IntersectionObserver, "displayName", 'IntersectionObserver');

process.env.NODE_ENV !== "production" ? IntersectionObserver.propTypes = {
  /**
   * The element that is used as the target to observe.
   */
  children: _propTypes.default.element,

  /**
   * The element that is used as the viewport for checking visibility of the target.
   * Can be specified as string for selector matching within the document.
   * Defaults to the browser viewport if not specified or if null.
   */
  root: _propTypes.default.oneOfType([_propTypes.default.string].concat(typeof HTMLElement === 'undefined' ? [] : _propTypes.default.instanceOf(HTMLElement))),

  /**
   * Margin around the root. Can have values similar to the CSS margin property,
   * e.g. "10px 20px 30px 40px" (top, right, bottom, left).
   * If the root element is specified, the values can be percentages.
   * This set of values serves to grow or shrink each side of the root element's
   * bounding box before computing intersections.
   * Defaults to all zeros.
   */
  rootMargin: _propTypes.default.string,

  /**
   * Either a single number or an array of numbers which indicate at what percentage
   * of the target's visibility the observer's callback should be executed.
   * If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5.
   * If you want the callback run every time visibility passes another 25%,
   * you would specify the array [0, 0.25, 0.5, 0.75, 1].
   * The default is 0 (meaning as soon as even one pixel is visible, the callback will be run).
   * A value of 1.0 means that the threshold isn't considered passed until every pixel is visible.
   */
  threshold: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.arrayOf(_propTypes.default.number)]),

  /**
   * Controls whether the element should stop being observed by its IntersectionObserver instance.
   * Defaults to false.
   */
  disabled: _propTypes.default.bool,

  /**
   * Function that will be invoked whenever the intersection value for this element changes.
   */
  onChange: _propTypes.default.func.isRequired
} : void 0;