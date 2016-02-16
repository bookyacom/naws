'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _koaGenericSession = require('koa-generic-session');

var _koaGenericSession2 = _interopRequireDefault(_koaGenericSession);

var _koaRedis = require('koa-redis');

var _koaRedis2 = _interopRequireDefault(_koaRedis);

var _koaPgSession = require('koa-pg-session');

var _koaPgSession2 = _interopRequireDefault(_koaPgSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Flash variable middleware
function flash(opts) {
  opts = opts || {};
  var key = opts.key || 'koa-flash';
  var defaultValue = opts.defaultValue || {};

  return _regenerator2.default.mark(function _callee(next) {
    var _this = this;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(this.session === undefined)) {
              _context.next = 2;
              break;
            }

            throw new Error('koa-flash requires the koa-session middleware.');

          case 2:
            Object.defineProperty(this, 'flash', {
              enumberable: true,
              get: function get() {
                var data = _this.session[key] || defaultValue;
                delete _this.session[key];
                return data;
              },
              set: function set(val) {
                _this.session[key] = val;
              }
            });

            return _context.delegateYield(next, 't0', 4);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
}

function pgStore(app) {
  var conf = app.conf;
  var username = conf['session database username'] || 'username';
  var password = conf['session database password'] || 'password';
  var host = conf['session host'] || 'localhost';
  var port = conf['session port'] || 5432;
  var database = conf['session database name'] || 'naws_session';
  var store = new _koaPgSession2.default('postgres://' + username + ':' + password + '@' + host + ':' + port + '/' + database);

  // TODO: this doesn't work properly, need to figure out why
  return (0, _koaGenericSession2.default)({ store: store });
}

function redisStore(app) {
  var conf = app.conf;
  var password = conf['session database username'];
  var host = conf['session host'];
  var port = conf['session port'];
  var store = (0, _koaRedis2.default)({
    host: host || 'localhost',
    port: port || 6379
  });

  if (password) {
    store = store.auth(password, function (err) {
      if (err) {
        return app.emit('error', err);
      }
    });
  }

  return (0, _koaGenericSession2.default)({ store: store });
}

function sessionify(app) {
  var conf = app.conf;
  app.keys = ['naws'];

  switch (conf['session store']) {
    case 'redis':
      app.use(redisStore(app));
      app.emit('trace', 'using redis memory session store');
      break;

    case 'postgres':
    case 'postgresql':
    case 'pg':
      app.use(pgStore(app));
      app.emit('trace', 'using postgresql memory session store');
      break;

    case 'memory':
    default:
      app.use((0, _koaGenericSession2.default)());
      app.emit('trace', 'using memory sessions store');
      break;
  }

  app.use(flash());
  return app;
}

exports.default = sessionify;
//# sourceMappingURL=session.js.map
