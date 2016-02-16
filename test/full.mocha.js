'use strict';

import fs from 'fs';
import co from 'co';
import naws from '..';
import supertest from 'supertest';

function setup(port, session) {
  let app = naws();
  app
    .set('base dir', __dirname)
    .set('view dir', 'mock/view')
    .set('asset dir', 'mock/asset')
    .set('view engine', 'swig')
    .init();

  app.get('/', function *() { this.body = 'OK'; });
  app.get('/render', app.render('full'));
  app.get('/session', function *() { this.body = (this.session) ? 'OK' : 'NO'; });
  app.post('/params/:check', function *() {
    let p = this.state.naws.params;
    this.body = (p.check === 'param' && p.qs === 'qs' && p.body === 'body') ? 'OK' : 'NO';
  });
  
  app.get('/flash', function *(next) {
    this.flash = 'OK';
    this.redirect('/flash-2');
  });

  app.get('/flash-2', function *(next) {
    this.body = this.flash;
  });

  app.get('/flash-3', function *(next) {
    let flash = this.flash;
    this.body = (typeof flash === 'object') && Object.keys(flash).length === 0;
  });

  app.get('/util/authcheck', 
    function *(next) {
      this.session.user = {};
      yield next;
    },
    app.util.authcheck('user', (ctx) => ctx.body = 'OK', (ctx) => ctx.body = 'NO'));
  
  // If session is enabled, use supertest's agent instead
  if (session)
    return supertest.agent(app.run(port));
  else
    return supertest(app.run(port));
}

function fread(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

describe('# Full test for NAWS', () => {

  after(() => process.exit(0));
  
  // Simple test cases requiring only one single request to go through
  describe('#one-req', () => {
    let html = '';

    before((done) => {
      co(function *() {
        // setup the HTML page
        html = yield fread(__dirname + '/mock/html/full.html');
      }).then(() => done()).catch((err) => done(err));
    });

    describe('simple', () => {
      it('OK', (done) => {
        setup(13711).get('/').expect('OK', done);
      });
    });

    describe('params', () => {
      it('OK', (done) => {
        setup(13712).post('/params/param?qs=qs').send({body:'body'}).expect('OK', done);
      })
    });

    describe('render', () => {
      it('OK', (done) => {
        setup(13713).get('/render').expect(html, done);
      });
    });

    describe('asset', () => {
      it('OK', (done) => {
        setup(13714).get('/asset.txt').expect('hello', done);
      });
    });

    describe('session', () => {
      it('OK', (done) => {
        setup(13715).get('/session').expect('OK', done);
      });
    });
  });

  
  // More complex test cases requiring 2 requests launched in sequence
  describe('#two-req', () => {
    it('OK', (done) => {
      let req = setup(13716, true);

      req.get('/flash').redirects(2).expect('OK', () => {
        req.get('/flash-3').expect('true', done);
      });
    });
  });

  describe('#util-check', () => {
    it('OK', (done) => {
      let req = setup(13717, true);

      req.get('/util/authcheck').expect('OK', done);
    });
  });
});