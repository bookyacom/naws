'use strict';

function log(app) {
  app.use(function *(next) {
    let self = this;

    // Add error and performance tracking shorthands
    this.stats = (ms, type, data) => {
      self.app.emit('perf', { ms : ms, type : type, data : data });
    }

    let start = new Date;
    let end   = new Date;
    let req   = this.request;

    yield *next;

    this.stats(end - start, 'page performance', `${req.method} ${req.url}`);
  });

  return app;
}

export default log;