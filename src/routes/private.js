const belt = require('../lib/belt');
const config = require('../config');
const path = require('path');
const rootPath = path.resolve(__dirname,'../../..');
module.exports = router => {
  router.post('/upload', async (ctx) => {
    ctx.validateBody('data').required('Invalid/Missing Data').isString('Invalid/Missing Data');
    ctx.validateBody('filepath').required('Invalid/Missing Filepath').isString('Invalid/Missing Filepath')
      .tap(f => path.normalize(`/${f.replace(/(\.){2,}(\/)/g,'')}`));
    ctx.validateQuery('convert').optional().isIn(['jpg','jpeg','png','webp'],'Allowed convert parameters jpg,jpeg,png,webp');
    try{
      const valid = await belt.validateFile(ctx.vals.data, path.join(rootPath,ctx.state.userinfo.dir), ctx.vals.filepath,1024,ctx.vals.convert);
      ctx.check(valid,'Invalid/Missing File');
      ctx.ok(`https://${ctx.state.userinfo.suburl}.${config.APIURL}${valid}`);
    }catch(e){
      ctx.fail(e.message);
    }    
  });
};
