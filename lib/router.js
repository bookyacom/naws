'use strict';

import parser from 'koa-bodyparser';
import Router from 'koa-router';

function routerify(app) {
  app.router = Router();
  app.router.use(parser());
  app.router.use(function *(next) {
    // Put all the params into state.naws.params;
    let req  = this.request;
    let body = req.body;
    let qs   = req.query;
    let par  = this.params;

    if (!this.state) {
      this.state = {};
    }

    this.state.naws = {};
    this.state.naws.params = Object.assign(body, qs, par);
    this.state.naws.url = this.request.url;
    
    yield *next;
  });

  return app;
}

export default routerify;