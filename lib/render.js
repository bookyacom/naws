'use strict';

import path from 'path';
import views from 'koa-views';
import assets from 'koa-static';

function render(app) {
  let conf   = app.conf;
  let base   = conf['base dir'];
  let view   = conf['view dir'];
  let asset  = conf['asset dir'];
  let dir    = base;
  let ass    = base;
  let engine = conf['view engine'] || 'swig';

  // Detemrine the directory to load views from.
  if (!base && view) {
    dir = view;
  } else if (base && view) {
    dir = path.join(base, view);
  }

  // Determine the directory to load assets from.
  if (!base && asset) {
    ass = asset;
  } else if (base && asset) {
    ass = path.join(base, asset);
  }

  app.use(assets(ass));

  app.use(views(dir, {
    map : { html : engine }
  }));

  return app;
}

export default render;