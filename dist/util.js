'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function util(naws, koa) {

  /**
   * authcheck checks for the existence of a property in the session (defaults
   * to `user`) and then if it exists, runs the function defined in success, or
   * failure if otherwise
   *
   * `success` and `failure` will be passed in the koa context (`this`), so you
   * can make calls like you normally do inside a koa middleware. Most of the
   * time you should use this to redirect instead.
   *
   * Example:
   *
   *  app.get('/', app.util.authcheck('user', (ctx) => ctx.redirect('/dashboard'), (ctx) => ctx.redirect('/login')));
   * 
   * @param  {string} check   [description]
   * @param  {function} success [description]
   * @param  {function} failure [description]
   * @return {[type]}         [description]
   */
  function authcheck(check, success, failure) {
    return _regenerator2.default.mark(function _callee(next) {
      var user;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              user = this.session.user;

              if (user && typeof success === 'function') {
                success(this);
              } else if (typeof failure === 'function') {
                failure(this);
              }

              _context.next = 4;
              return next;

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    });
  }

  naws.util = {
    authcheck: authcheck
  };

  return koa;
}

exports.default = util;
//# sourceMappingURL=util.js.map
