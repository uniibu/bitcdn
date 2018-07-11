const { ValidationError, middleware } = require('koa-bouncer');

exports.middleware = middleware;
exports.jsonRespond = require('./jsonRespond');

exports.catchError = () => async function catchError (ctx, next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof ValidationError) {
      ctx.fail(err.message);
    } else if (typeof err === 'string') {
      ctx.fail(err);
    } else {
      console.error({ error: err.stack || err.message });
      ctx.internalServerError('Internal_Error');
    }
    ctx.app.emit('error', err, ctx);
  }
};
exports.methodOverride = () => async function methodOverride (ctx, next) {
  if (typeof ctx.request.body === 'undefined') {
    throw new Error('methodOverride middleware must be applied after the body is parsed and ctx.request.body is populated');
  }
  if (ctx.request.body && ctx.request.body._method) {
    ctx.method = ctx.request.body._method.toUpperCase();
    delete ctx.request.body._method;
  }
  await next();
};
