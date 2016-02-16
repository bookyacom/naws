'use strict';

/**
 * Usage:
 *
 *  import session from './session';
 *
 *  _.get('/',
 *    session('authcheck')
 *  );
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (params) {
  return _regenerator2.default.mark(function _callee(next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return next;

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
};

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var trace = (0, _debug2.default)('ow:session:trace');
var error = (0, _debug2.default)('ow:session:error');

var authcheck = function authcheck(ctx) {
  var user = ctx.session.user;

  if (user) {
    return true;
  }

  return false;
};
//# sourceMappingURL=session.js.map
