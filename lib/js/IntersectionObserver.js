'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.callback = callback;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _IntersectionObserverContainer = require('./IntersectionObserverContainer');

var _IntersectionObserverContainer2 = _interopRequireDefault(_IntersectionObserverContainer);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Intersection Observer API callback that is called whenever one element,
 * called the target, intersects either the device viewport or a specified element.
 * Also will get caled whenever the visibility of the target element changes and
 * crosses desired amounts of intersection with the root.
 * @param {array} changes
 * @param {IntersectionObserver} observer
 */
function callback(changes, observer) {
    changes.forEach(function (entry) {
        var instance = _IntersectionObserverContainer2.default.findElement(entry, observer);
        if (instance) {
            instance.handleChange(entry);
        }
    });
}

var observerOptions = ['root', 'rootMargin', 'threshold'];
var objectProto = Object.prototype;

var IntersectionObserver = function (_React$Component) {
    _inherits(IntersectionObserver, _React$Component);

    function IntersectionObserver() {
        var _temp, _this, _ret;

        _classCallCheck(this, IntersectionObserver);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleChange = function (event) {
            _this.props.onChange(event);

            if (_this.props.onlyOnce) {
                // eslint-disable-next-line no-undef
                if (process.env.NODE_ENV !== 'production') {
                    (0, _invariant2.default)('isIntersecting' in event, "onlyOnce requires isIntersecting to exists in IntersectionObserverEntry's prototype. Either your browser or your polyfill lacks support.");
                }
                if (event.isIntersecting) {
                    _this.unobserve();
                }
            }
        }, _this.handleNode = function (node) {
            if (typeof _this.props.children.ref === 'function') {
                _this.props.children.ref(node);
            }
            if (_this.currentTarget && node && _this.currentTarget !== node) {
                _this.unobserve();
                _this.shouldResetObserver = true;
            }
            _this.target = node;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    IntersectionObserver.prototype.observe = function observe() {
        this.target = (0, _utils.isDOMTypeElement)(this.target) ? this.target : this.target ? (0, _reactDom.findDOMNode)(this.target) : (0, _reactDom.findDOMNode)(this);
        this.observer = _IntersectionObserverContainer2.default.create(callback, this.options);
        _IntersectionObserverContainer2.default.observe(this);
    };

    IntersectionObserver.prototype.unobserve = function unobserve() {
        _IntersectionObserverContainer2.default.unobserve(this);
    };

    IntersectionObserver.prototype.reobserve = function reobserve() {
        this.unobserve();
        if (!this.props.disabled) {
            this.observe();
        }
    };

    IntersectionObserver.prototype.componentDidMount = function componentDidMount() {
        // eslint-disable-next-line no-undef
        if (process.env.NODE_ENV !== 'production' && parseInt(_react2.default.version, 10) < 16) {
            (0, _invariant2.default)(this.target, 'Stateless function components cannot be given refs. Attempts to access this ref will fail.');
        }
        if (!this.props.disabled) {
            this.observe();
        }
    };

    IntersectionObserver.prototype.componentWillUnmount = function componentWillUnmount() {
        this.unobserve();
    };

    IntersectionObserver.prototype.componentDidUpdate = function componentDidUpdate() {
        if (this.shouldResetObserver) {
            this.reobserve();
        }
    };

    IntersectionObserver.prototype.componentWillUpdate = function componentWillUpdate(nextProps) {
        var _this2 = this;

        this.shouldResetObserver = observerOptions.concat(['disabled']).some(function (option) {
            return (0, _utils.shallowCompareOptions)(nextProps[option], _this2.props[option]);
        });
    };

    IntersectionObserver.prototype.render = function render() {
        this.currentTarget = this.target;

        return _react2.default.cloneElement(_react2.default.Children.only(this.props.children), {
            ref: this.handleNode
        });
    };

    _createClass(IntersectionObserver, [{
        key: 'options',
        get: function get() {
            var _this3 = this;

            return observerOptions.reduce(function (prev, key) {
                if (objectProto.hasOwnProperty.call(_this3.props, key)) {
                    var _Object$assign;

                    var value = _this3.props[key];
                    if (key === 'root' && objectProto.toString.call(_this3.props[key]) === '[object String]') {
                        value = document.querySelector(value);
                    }
                    return Object.assign({}, prev, (_Object$assign = {}, _Object$assign[key] = value, _Object$assign));
                }
                return prev;
            }, {});
        }
    }]);

    return IntersectionObserver;
}(_react2.default.Component);

IntersectionObserver.displayName = 'IntersectionObserver';
exports.default = IntersectionObserver;
process.env.NODE_ENV !== "production" ? IntersectionObserver.propTypes = {
    /**
     * The element that is used as the target to observe.
     */
    children: _propTypes2.default.element.isRequired,

    /**
     * The element that is used as the viewport for checking visibility of the target.
     * Can be specified as string for selector matching within the document.
     * Defaults to the browser viewport if not specified or if null.
     */
    root: _propTypes2.default.oneOfType([_propTypes2.default.string].concat(typeof HTMLElement === 'undefined' ? [] : _propTypes2.default.instanceOf(HTMLElement))),

    /**
     * Margin around the root. Can have values similar to the CSS margin property,
     * e.g. "10px 20px 30px 40px" (top, right, bottom, left).
     * If the root element is specified, the values can be percentages.
     * This set of values serves to grow or shrink each side of the root element's
     * bounding box before computing intersections.
     * Defaults to all zeros.
     */
    rootMargin: _propTypes2.default.string,

    /**
     * Either a single number or an array of numbers which indicate at what percentage
     * of the target's visibility the observer's callback should be executed.
     * If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5.
     * If you want the callback run every time visibility passes another 25%,
     * you would specify the array [0, 0.25, 0.5, 0.75, 1].
     * The default is 0 (meaning as soon as even one pixel is visible, the callback will be run).
     * A value of 1.0 means that the threshold isn't considered passed until every pixel is visible.
     */
    threshold: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.arrayOf(_propTypes2.default.number)]),

    /**
     * When true indicate that events fire only until the element is intersecting.
     * Different browsers behave differently towards the isIntersecting property, make sure
     * you polyfill and/or override the IntersectionObserverEntry object's prototype to your needs.
     * Defaults to false.
     */
    onlyOnce: _propTypes2.default.bool,

    /**
     * Controls whether the element should stop being observed by its IntersectionObserver instance.
     * Defaults to false.
     */
    disabled: _propTypes2.default.bool,

    /**
     * Function that will be invoked whenever the intersection value for this element changes.
     */
    onChange: _propTypes2.default.func.isRequired
} : void 0;