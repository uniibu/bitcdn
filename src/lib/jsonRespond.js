const statusCodes = {
  ok: 200,
  fail: 400,
  noContent: 204,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500
};

function Respond () {
  return async function respond (ctx, next) {
    for (const [status, code] of Object.entries(statusCodes)) {
      ctx[status] = msg => {
        const success = code == 200;
        const payload = { success };
        if (msg) payload.data = msg;
        ctx.status = code;
        ctx.body = payload;
      };
    }
    await next();
  };
}
module.exports = Respond;
