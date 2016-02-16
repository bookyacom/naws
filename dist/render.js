'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaViews = require('koa-views');

var _koaViews2 = _interopRequireDefault(_koaViews);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(app) {
  var conf = app.conf;
  var base = conf['base dir'];
  var view = conf['view dir'];
  var asset = conf['asset dir'];
  var dir = base;
  var ass = base;
  var engine = conf['view engine'] || 'swig';

  // Detemrine the directory to load views from.
  if (!base && view) {
    dir = view;
  } else if (base && view) {
    dir = _path2.default.join(base, view);
  }

  // Determine the directory to load assets from.
  if (!base && asset) {
    ass = asset;
  } else if (base && asset) {
    ass = _path2.default.join(base, asset);
  }

  app.use((0, _koaStatic2.default)(ass));

  app.use((0, _koaViews2.default)(dir, {
    map: { html: engine }
  }));

  return app;
}

exports.default = render;
//# sourceMappingURL=render.js.map
