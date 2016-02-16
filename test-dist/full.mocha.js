'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setup(port, session) {
  var app = (0, _2.default)();
  app.set('base dir', __dirname).set('view dir', 'mock/view').set('asset dir', 'mock/asset').set('view engine', 'swig').init();

  app.get('/', _regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.body = 'OK';
          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  app.get('/render', app.render('full'));
  app.get('/session', _regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.body = this.session ? 'OK' : 'NO';
          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  app.post('/params/:check', _regenerator2.default.mark(function _callee3() {
    var p;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            p = this.state.naws.params;

            this.body = p.check === 'param' && p.qs === 'qs' && p.body === 'body' ? 'OK' : 'NO';

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  app.get('/flash', _regenerator2.default.mark(function _callee4(next) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            this.flash = 'OK';
            this.redirect('/flash-2');

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  app.get('/flash-2', _regenerator2.default.mark(function _callee5(next) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            this.body = this.flash;

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  app.get('/flash-3', _regenerator2.default.mark(function _callee6(next) {
    var flash;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            flash = this.flash;

            this.body = (typeof flash === 'undefined' ? 'undefined' : (0, _typeof3.default)(flash)) === 'object' && (0, _keys2.default)(flash).length === 0;

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  app.get('/util/authcheck', _regenerator2.default.mark(function _callee7(next) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            this.session.user = {};
            _context7.next = 3;
            return next;

          case 3:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }), app.util.authcheck('user', function (ctx) {
    return ctx.body = 'OK';
  }, function (ctx) {
    return ctx.body = 'NO';
  }));

  // If session is enabled, use supertest's agent instead
  if (session) return _supertest2.default.agent(app.run(port));else return (0, _supertest2.default)(app.run(port));
}

function fread(path) {
  return new _promise2.default(function (resolve, reject) {
    _fs2.default.readFile(path, 'utf8', function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

describe('# Full test for NAWS', function () {

  after(function () {
    return process.exit(0);
  });

  // Simple test cases requiring only one single request to go through
  describe('#one-req', function () {
    var html = '';

    before(function (done) {
      (0, _co2.default)(_regenerator2.default.mark(function _callee8() {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return fread(__dirname + '/mock/html/full.html');

              case 2:
                html = _context8.sent;

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      })).then(function () {
        return done();
      }).catch(function (err) {
        return done(err);
      });
    });

    describe('simple', function () {
      it('OK', function (done) {
        setup(13711).get('/').expect('OK', done);
      });
    });

    describe('params', function () {
      it('OK', function (done) {
        setup(13712).post('/params/param?qs=qs').send({ body: 'body' }).expect('OK', done);
      });
    });

    describe('render', function () {
      it('OK', function (done) {
        setup(13713).get('/render').expect(html, done);
      });
    });

    describe('asset', function () {
      it('OK', function (done) {
        setup(13714).get('/asset.txt').expect('hello', done);
      });
    });

    describe('session', function () {
      it('OK', function (done) {
        setup(13715).get('/session').expect('OK', done);
      });
    });
  });

  // More complex test cases requiring 2 requests launched in sequence
  describe('#two-req', function () {
    it('OK', function (done) {
      var req = setup(13716, true);

      req.get('/flash').redirects(2).expect('OK', function () {
        req.get('/flash-3').expect('true', done);
      });
    });
  });

  describe('#util-check', function () {
    it('OK', function (done) {
      var req = setup(13717, true);

      req.get('/util/authcheck').expect('OK', done);
    });
  });
});
//# sourceMappingURL=full.mocha.js.map
