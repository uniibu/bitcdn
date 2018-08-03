const belt = require('../lib/belt');
const config = require('../config');
const path = require('path');
const rootPath = path.resolve(__dirname, '../../..');
const fs = require('fs-extra');
module.exports = router => {
  router.post('/deleteimage', async (ctx) => {
    ctx.validateBody('filename').required('Invalid/Missing Filename').isString(
      'Invalid/Missing Filename');
    const uinfoDir = ctx.state.userinfo.dir;
    const subUrl = `https://${ctx.state.userinfo.suburl}.bitcdn.host/${ctx.vals.filename}`;
    const fileUrls = [];
    const files = ['.jpg', '.jpeg', '.png', '.webp'].map(ext => {
      fileUrls.push(subUrl + ext);
      return path.join(rootPath, uinfoDir, ctx.vals.filename + ext);
    });
    try {
      for (const f of files) {
        await fs.remove(f);
      }
      const resp = await belt.clearCfCache(fileUrls);
      ctx.check(resp.success == true, 'Failed clearing cache');
      ctx.ok();
    } catch (e) {
      ctx.fail(e.message);
    }
  });
  router.post('/upload', async (ctx) => {
    ctx.validateBody('data').required('Invalid/Missing Data').isString('Invalid/Missing Data');
    ctx.validateBody('filepath').required('Invalid/Missing Filepath').isString(
      'Invalid/Missing Filepath')
      .tap(f => path.normalize(`/${f.replace(/(\.){2,}(\/)/g, '')}`));
    ctx.validateQuery('convert').optional().isIn(['jpg', 'jpeg', 'png', 'webp'],
      'Allowed convert parameters jpg,jpeg,png,webp');
    ctx.validateQuery('optimized').optional().isString('Invalid Query');
    try {
      const uinfoDir = ctx.state.userinfo.dir;
      const valid = await belt.validateFile(ctx.vals.data, path.join(rootPath, uinfoDir),
        ctx.vals.filepath, 1024, ctx.vals.convert, ctx.vals.optimized);
      ctx.check(valid, 'Invalid/Missing File');
      if (ctx.vals.optimized && Array.isArray(valid)) {
        ctx.ok({
          original: `https://${ctx.state.userinfo.suburl}.${config.APIURL}${valid[0]}`,
          optimized: `https://${ctx.state.userinfo.suburl}.${config.APIURL}${valid[1]}`
        });
      } else {
        ctx.ok(`https://${ctx.state.userinfo.suburl}.${config.APIURL}${valid}`);
      }
    } catch (e) {
      ctx.fail(e.message);
    }
  });
  router.post('/uploadurl', async ctx => {
    ctx.validateBody('url').required('Invalid/Missing Url').isString('Invalid/Missing Url');
    ctx.validateQuery('convert').optional().isIn(['jpg', 'jpeg', 'png', 'webp'],
      'Allowed convert parameters jpg,jpeg,png,webp');
    ctx.validateQuery('optimized').optional().isString('Invalid Query');
    try {
      const uinfoDir = ctx.state.userinfo.dir;
      const valid = await belt.processFetchUrl(ctx.vals.url, path.join(rootPath, uinfoDir),
        ctx.vals.convert, ctx.vals.optimized);
      ctx.check(valid, 'Invalid/Missing File');
      if (ctx.vals.optimized && Array.isArray(valid)) {
        ctx.ok({
          original: `https://${ctx.state.userinfo.suburl}.${config.APIURL}${valid[0]}`,
          optimized: `https://${ctx.state.userinfo.suburl}.${config.APIURL}${valid[1]}`
        });
      } else {
        ctx.ok(`https://${ctx.state.userinfo.suburl}.${config.APIURL}${valid}`);
      }
    } catch (e) {
      ctx.fail(e.message);
    }
  });
};