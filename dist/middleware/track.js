'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return _regenerator2.default.mark(function _callee(next) {
    var before, after, perf;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            before = Date.now();
            _context.next = 3;
            return next;

          case 3:
            after = Date.now();
            perf = after - before;

            trace('Page performance: ' + perf + 'ms');

          case 6:
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

var trace = (0, _debug2.default)('ow:trace');
//# sourceMappingURL=track.js.map
