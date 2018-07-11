const Koa = require('koa');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const config = require('./config');
const lib = require('./lib');
const app = new Koa();

app.env = config.NODE_ENV;
app.port = config.PORT;
app.proxy = config.TRUST_PROXY;

app.use(logger());

app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST'],
  maxAge: 24 * 60 * 60
}));

app.use(require('koa-helmet')());
app.use(
  require('koa-bodyparser')({
    extendTypes: { json: ['text/plain'] },
    enableTypes: ['json'],
    onerror (err, ctx) {
      console.error(err.stack || err.message);
      ctx.throw(422, { error: 'Error parsing request' });
    }
  })
);

app.use(lib.methodOverride());
app.use(lib.middleware());
app.use(lib.catchError());
app.use(lib.jsonRespond());
app.use(require('./routes').routes());
app.on('error', (err, ctx) => {
  console.error(err, ctx);
});
app.use((ctx) => {
  ctx.notFound('Endpoint not found');
});
module.exports = app;