'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return _regenerator2.default.mark(function _callee(next) {
    var context, query, body, params, vars;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            context = this.state;
            query = this.request.query || {};
            body = this.request.body || {};
            params = this.params || {};

            // Merge query, body and params together

            (0, _assert2.default)((typeof query === 'undefined' ? 'undefined' : (0, _typeof3.default)(query)) === 'object');
            (0, _assert2.default)((typeof body === 'undefined' ? 'undefined' : (0, _typeof3.default)(body)) === 'object');
            (0, _assert2.default)((typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) === 'object');

            if (!this.state) {
              this.state = {};
            }

            vars = (0, _assign2.default)(query, body, params);

            this.state.vars = vars;

            _context.next = 12;
            return next;

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
};

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var trace = (0, _debug2.default)('ow:middleware:vars');
//# sourceMappingURL=vars.js.map
