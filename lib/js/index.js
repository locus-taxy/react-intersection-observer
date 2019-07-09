"use strict";

exports.__esModule = true;
exports.parseRootMargin = exports.Config = exports.default = void 0;

var _IntersectionObserver = _interopRequireDefault(require("./IntersectionObserver"));

exports.default = _IntersectionObserver.default;

var _utils = require("./utils");

exports.parseRootMargin = _utils.parseRootMargin;

var _config = _interopRequireDefault(require("./config"));

exports.Config = _config.default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }