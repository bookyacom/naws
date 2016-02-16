'use strict';

import session from 'koa-generic-session';
import redis from 'koa-redis';
import pg from 'koa-pg-session';

// Flash variable middleware
function flash(opts) {
  opts = opts || {};
  let key = opts.key || 'koa-flash';
  let defaultValue = opts.defaultValue || {};

  return function *(next) {
    if (this.session === undefined) throw new Error('koa-flash requires the koa-session middleware.');
    Object.defineProperty(this, 'flash', {
      enumberable : true,
      get: () => {
        let data = this.session[key] || defaultValue;
        delete this.session[key];
        return data;
      },
      set: (val) => {
        this.session[key] = val;
      }
    });

    yield *next;
  }
}

function pgStore(app) {
  let conf = app.conf;
  let username = conf['session database username'] || 'username';
  let password = conf['session database password'] || 'password';
  let host = conf['session host'] || 'localhost';
  let port = conf['session port'] || 5432;
  let database = conf['session database name'] || 'naws_session';
  let store = new pg(`postgres://${username}:${password}@${host}:${port}/${database}`);

  // TODO: this doesn't work properly, need to figure out why
  return session({ store : store });
}

function redisStore(app) {
  let conf = app.conf;
  let password = conf['session database username'];
  let host = conf['session host'];
  let port = conf['session port'];
  let store = redis({
    host : host || 'localhost',
    port : port || 6379
  });

  if (password) {
    store = store.auth(password, (err) => {if (err) { return app.emit('error', err); }});
  }

  return session({ store : store });
}

function sessionify(app) {
  let conf = app.conf;
  app.keys = ['naws'];

  switch(conf['session store']) {
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
      app.use(session());
      app.emit('trace', 'using memory sessions store');
      break;
  }

  app.use(flash());
  return app;
}

export default sessionify;