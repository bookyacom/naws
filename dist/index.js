'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _sourceMapSupport = require('source-map-support');

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _session = require('./session');

var _session2 = _interopRequireDefault(_session);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sourceMapSupport.install)();

var trace = (0, _debug2.default)('naws:trace');
var metric = (0, _debug2.default)('naws:metric');
var error = (0, _debug2.default)('naws:error');

var Naws = (function () {
  (0, _createClass3.default)(Naws, null, [{
    key: 'make',
    value: function make() {
      return new Naws();
    }
  }]);

  function Naws() {
    (0, _classCallCheck3.default)(this, Naws);

    this.app = (0, _koa2.default)();
    this.app.conf = {
      // directory configuration
      'base dir': process.cwd(),
      'handler dir': 'handler',
      'view dir': 'view',
      'layout dir': 'layout',
      'asset dir': 'asset',

      // server configuration
      'server port': 13371,

      // session configuration
      'session store': 'memory',
      'session host': 'localhost',
      'session port': 6379,

      // renderer configuration
      'view engine': 'html',
      'view ext': '.html'
    };

    this.trace = trace;
    this.error = error;
    this.metric = metric;
    this.util = {};
  }

  (0, _createClass3.default)(Naws, [{
    key: 'init',
    value: function init() {
      var app = this.app;

      // This way, you can `this.app.emit('trace', '...')` to send output to trace
      app.on('trace', function (msg) {
        trace(msg);
      });

      // This way, you can `this.app.emit('perf', '...')` to send output to metrics
      app.on('perf', function (details) {
        metric(details.ms + 'ms | ' + details.type + ' | ' + details.data);
      });

      // This way, you can `this.app.emit('error', '...')` to send output to error
      app.on('error', function (err) {
        if (typeof err === 'string') {
          err = new Error(err);
        }

        error(err);
      });

      app = (0, _log2.default)(app);
      app = (0, _session2.default)(app);
      app = (0, _router2.default)(app);
      app = (0, _util2.default)(this, app);
      app = (0, _render2.default)(app);

      return this;
    }

    /**
     * .set(config, value)
     *
     * Sets a config in NAWS with new value. Supported config are:
     *
     * - base dir
     * - model dir
     * - handler dir
     * - view dir
     * - layout dir
     * - server port
     * - session store
     * - view engine
     * - view ext
     * 
     * @param {String} config Config to change
     * @param {Mixed} value   A value to assign to the config
     */

  }, {
    key: 'set',
    value: function set(config, value) {
      // Make sure only legit config are set
      var conf = this.app.conf;
      var keys = (0, _keys2.default)(conf);

      if (keys.indexOf(config) === -1) {
        error(config + ' is an invalid config');
        error('Only these keys are supported: ' + keys.join(','));
        return this;
      }

      var old = conf[config];
      conf[config] = value;
      trace(config + ' changed value from ' + old + ' -> ' + value);

      return this;
    }
  }, {
    key: 'get',
    value: function get() {
      var arg = Array.prototype.slice.call(arguments);
      var _ = this.app.router;
      _.get.apply(_, arg);
      return this;
    }
  }, {
    key: 'post',
    value: function post() {
      var arg = Array.prototype.slice.call(arguments);
      var _ = this.app.router;
      _.post.apply(_, arg);
      return this;
    }
  }, {
    key: 'head',
    value: function head() {
      var arg = Array.prototype.slice.call(arguments);
      var _ = this.app.router;
      _.head.apply(_, arg);
      return this;
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var arg = Array.prototype.slice.call(arguments);
      var _ = this.app.router;
      _.delete.apply(_, arg);
      return this;
    }
  }, {
    key: 'put',
    value: function put() {
      var arg = Array.prototype.slice.call(arguments);
      var _ = this.app.router;
      _.put.apply(_, arg);
      return this;
    }
  }, {
    key: 'head',
    value: function head() {
      var arg = Array.prototype.slice.call(arguments);
      var _ = this.app.router;
      _.head.apply(_, arg);
      return this;
    }
  }, {
    key: 'run',
    value: function run(port) {
      // Initialise the router
      var app = this.app;
      var router = app.router;

      app.use(app.router.routes());
      app.use(app.router.allowedMethods());

      app.server = app.listen(port || this.app.conf['server port']);
      return app.server;
    }
  }, {
    key: 'stop',
    value: function stop() {
      app.server.close();
    }
  }, {
    key: 'handler',
    value: function handler() {
      var args = Array.prototype.slice.call(arguments);
      var name = args.shift();
      var conf = this.app.conf;
      var hpath = _path2.default.join(conf['base dir'], conf['handler dir'], name);
      return require(hpath).default(this, this.app);
    }
  }, {
    key: 'render',
    value: function render(view, extras) {
      return _regenerator2.default.mark(function _callee(next) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return next;

              case 2:
                _context.next = 4;
                return this.render(view, extras);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      });
    }
  }]);
  return Naws;
})();

;

var make = Naws.make;

exports.default = make;
//# sourceMappingURL=index.js.map
