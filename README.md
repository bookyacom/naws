# NAWS - Not Another Web Server

It actually is another web server. Oh well.

## Usage

NAWS uses babel compiler integrated into the `gulpfile.babel.js`. Normally, you would not need to modify _anything_ at all to use NAWS. However, should you need to make changes to it, this is what you need to do:

```
$[admin/naws]- npm install
$[admin/naws]- gulp build
$[admin/naws]- npm install swig
```

This will take the code from `v1` and `test`, and build them into `dist` and `test-dist` respectively.

## Core Philosophy

Philosophy. Hah. 'neways, the idea of NAWS is to allow _middleware chaining_ for `koa.js`. Imagine this code:

```
router.get('/',
  middleware1,  // a function that and saves its result into this.state.naws
  middleware2,  // a function that and saves its result into this.state.naws
  middleware3,  // a function that and saves its result into this.state.naws
  function *(next) {
    const data1 = this.state.naws.middleware1;
    const data2 = this.state.naws.middleware2;
    const data3 = this.state.naws.middleware3;
    this.body = [data1, data2, data3].join(' ');
  }
);
```

In essence, `this.state.naws` becomes an in-memory variable store for all middlewares to store values to.

Why do it this way? Simply said, you can do shit like this:

```
router.get('/',
  check_authentication,
  cleanup_params,
  query_database,
  transform_results,
  render_page
);
```

In this scheme, `check_authentication`, `cleanup_params` and `render_page` can be written to be as general as possible, so that it can be reused in other routes easily.

This is a better way (IMO) to create webapps: leverage the power that koa provides with middlewares, and use it to better structure your app so that it's readable and more maintainable. Drastically reduces the WTF/s metric in your office, trust me.

## API Reference

Sample starting code:

```
let naws = require('naws')();

naws.set('base dir', __dirname).init();

// add a custom middleware
naws.app.use(function () ... );

// setup a simple route
naws.get('/', naws.handler('user'), naws.render('index'));

naws.run();
```
### `this.state.naws`

NAWS adds `naws` to `this.state`. This is automatically injected into templates (accessible via `naws.<var name>`) and can be accessed by all middlewares. Use this to store data to pass along to other middlewares.

### `this.state.naws.params`

This is a combination of `querystring`, `body params` and `URI params`. This means it contains:

* `http://who.me?dog=woof` will have `this.state.naws.params.dog` with value `woof`
* Form with `username` will have `this.state.naws.params.username`
* The URI `naws.get('/user/:id')` will have `this.state.naws.params.id`

### `naws.set(<config>, <value>)`

Sets a config bit. This must be called before `naws.init()`.

* `base dir` - the base directory for `handler dir`, `view dir`, `layout dir` and `asset dir`
* `handler dir` - the dir to find all handlers (aka middlewares)
* `view dir` - the dir to find all views (aka templates)
* `layout dir` - not really used if you're using swig
* `asset dir` - served as static files using `koa-static`
* `server port` - port the webapp will listen on
* `session store` - `redis` for now
* `session host` - host of the session store
* `session port` - port of the sessions store
* `view engine` - swig for now
* `view ext` - html for now

### `naws.init()`

Initializes all configuration. Must be run _after_ `naws.set()`.

### `naws.app`

Koa app embedded inside NAWS.

### `naws.get|post|head|put|delete()`

Shortcut to `koa-router` methods.

### `naws.run(<port>)`

If `port` is supplied, NAWS will run on that port. Otherwise, it'll use the config `server port` which defaults to 13371.

### `naws.handler(<name>)`

A handler is a function that returns a middleware. Here's how one looks like:

```
function handler() {
  return function *(next) {
    ...
  }
}
```

Remember, save the results into `this.state.naws`.

### `naws.render(<view>, <extras>)`

Renders from the template `view`, with extra local variables from `extras`. Note that `this.state` is injected into the view.
