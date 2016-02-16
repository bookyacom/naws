'use strict';

function util(naws, koa) {

  /**
   * authcheck checks for the existence of a property in the session (defaults
   * to `user`) and then if it exists, runs the function defined in success, or
   * failure if otherwise
   *
   * `success` and `failure` will be passed in the koa context (`this`), so you
   * can make calls like you normally do inside a koa middleware. Most of the
   * time you should use this to redirect instead.
   *
   * Example:
   *
   *  app.get('/', app.util.authcheck('user', (ctx) => ctx.redirect('/dashboard'), (ctx) => ctx.redirect('/login')));
   * 
   * @param  {string} check   [description]
   * @param  {function} success [description]
   * @param  {function} failure [description]
   * @return {[type]}         [description]
   */
  function authcheck(check, success, failure) {
    return function *(next) {
      let user = this.session.user;
      if (user && typeof success === 'function') {
        success(this);
      } else if (typeof failure === 'function') {
        failure(this);
      }

      yield next;
    }
  }

  naws.util = {
    authcheck : authcheck
  };
  
  return koa;
}

export default util;