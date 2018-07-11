const Router = require('koa-router');
const router = new Router();
const ensureUser = require('../lib/ensureUser');
// public
require('./public')(router);
// private
router.use(ensureUser());
require('./private')(router);
module.exports = router;
