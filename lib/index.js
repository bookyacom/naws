'use strict';

import path from 'path';
import debug from 'debug';
import koa from 'koa';
import { install } from 'source-map-support';
install();

import routerify from './router';
import logify from './log';
import utilify from './util';
import renderify from './render';
import sessionify from './session';

const trace  = debug('naws:trace');
const metric = debug('naws:metric');
const error  = debug('naws:error');

class Naws {
  static make() {
    return new Naws();
  }

  constructor() {
    this.app = koa();
    this.app.conf = {
      // directory configuration
      'base dir'    : process.cwd(),
      'handler dir' : 'handler',
      'view dir'    : 'view',
      'layout dir'  : 'layout',
      'asset dir'   : 'asset',

      // server configuration
      'server port' : 13371,

      // session configuration
      'session store' : 'memory',
      'session host' : 'localhost',
      'session port' : 6379,

      // renderer configuration
      'view engine' : 'html',
      'view ext'    : '.html'
    };

    this.trace = trace;
    this.error = error;
    this.metric = metric;
    this.util = {};
  }

  init() {
    let app = this.app;

    // This way, you can `this.app.emit('trace', '...')` to send output to trace
    app.on('trace', function (msg) {
      trace(msg);
    });

    // This way, you can `this.app.emit('perf', '...')` to send output to metrics
    app.on('perf', function (details) {
      metric(`${details.ms}ms | ${details.type} | ${details.data}`);
    });

    // This way, you can `this.app.emit('error', '...')` to send output to error
    app.on('error', function (err) {
      if (typeof err === 'string') {
        err = new Error(err);
      }

      error(err);
    });

    app = logify(app);
    app = sessionify(app);
    app = routerify(app);
    app = utilify(this, app);
    app = renderify(app);

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
  set(config, value) {
    // Make sure only legit config are set
    let conf = this.app.conf;
    let keys = Object.keys(conf);

    if (keys.indexOf(config) === -1) {
      error(`${config} is an invalid config`);
      error(`Only these keys are supported: ${keys.join(',')}`);
      return this;
    }

    let old = conf[config];
    conf[config] = value;
    trace(`${config} changed value from ${old} -> ${value}`);

    return this;
  }

  get() {
    let arg = Array.prototype.slice.call(arguments);
    let _ = this.app.router;
    _.get.apply(_, arg);
    return this;
  }

  post() {
    let arg = Array.prototype.slice.call(arguments);
    let _ = this.app.router;
    _.post.apply(_, arg);
    return this;
  }

  head() {
    let arg = Array.prototype.slice.call(arguments);
    let _ = this.app.router;
    _.head.apply(_, arg);
    return this;
  }

  delete() {
    let arg = Array.prototype.slice.call(arguments);
    let _ = this.app.router;
    _.delete.apply(_, arg);
    return this;
  }

  put() {
    let arg = Array.prototype.slice.call(arguments);
    let _ = this.app.router;
    _.put.apply(_, arg);
    return this;
  }

  head() {
    let arg = Array.prototype.slice.call(arguments);
    let _ = this.app.router;
    _.head.apply(_, arg);
    return this;
  }

  run(port) {
    // Initialise the router
    let app = this.app;
    let router = app.router;
    
    app.use(app.router.routes());
    app.use(app.router.allowedMethods());

    app.server = app.listen(port || this.app.conf['server port']);
    return app.server;
  }

  stop() {
    app.server.close();
  }

  handler() {
    let args  = Array.prototype.slice.call(arguments);
    let name  = args.shift();
    let conf  = this.app.conf;
    let hpath = path.join(conf['base dir'], conf['handler dir'], name);
    return require(hpath).default(this, this.app);
  }

  render(view, extras) {
    return function*(next) {
      yield next;
      // Compile locals
      yield this.render(view, extras);
    };
  }
};

let make = Naws.make;

export default make;