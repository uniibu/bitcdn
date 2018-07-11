const config = require('../config');

const getKeys = uuid => {
  let keys = null;
  for(const v of config.KEYS){
    if(v.uuid === uuid){
      keys = v;
    }
  }
  return keys;
};

module.exports = () => async (ctx, next) => {
  ctx.validateBody('token').required('Invalid Token').isString('Invalid Token')
    .isUuid('v4', 'Invalid Token');

  const userinfo = getKeys(ctx.vals.token);
  ctx.check(userinfo, 'Invalid Token');

  ctx.state.userinfo = userinfo;
  await next();
};
