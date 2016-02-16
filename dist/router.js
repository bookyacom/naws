'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routerify(app) {
  app.router = (0, _koaRouter2.default)();
  app.router.use((0, _koaBodyparser2.default)());
  app.router.use(_regenerator2.default.mark(function _callee(next) {
    var req, body, qs, par;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Put all the params into state.naws.params;
            req = this.request;
            body = req.body;
            qs = req.query;
            par = this.params;

            if (!this.state) {
              this.state = {};
            }

            this.state.naws = {};
            this.state.naws.params = (0, _assign2.default)(body, qs, par);
            this.state.naws.url = this.request.url;

            return _context.delegateYield(next, 't0', 9);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return app;
}

exports.default = routerify;
//# sourceMappingURL=router.js.map
