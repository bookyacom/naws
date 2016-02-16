'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function log(app) {
  app.use(_regenerator2.default.mark(function _callee(next) {
    var self, start, end, req;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            self = this;

            // Add error and performance tracking shorthands

            this.stats = function (ms, type, data) {
              self.app.emit('perf', { ms: ms, type: type, data: data });
            };

            start = new Date();
            end = new Date();
            req = this.request;
            return _context.delegateYield(next, 't0', 6);

          case 6:

            this.stats(end - start, 'page performance', req.method + ' ' + req.url);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return app;
}

exports.default = log;
//# sourceMappingURL=log.js.map
