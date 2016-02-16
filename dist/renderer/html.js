'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (engine, params) {
  return _regenerator2.default.mark(function _callee() {
    var contents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contents = this.state.contents;

            this.status = 200;
            this.body = contents;
            this.type = 'text/html';

            _context.next = 6;
            return this.render();

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=html.js.map
