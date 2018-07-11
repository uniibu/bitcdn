const belt = require('../lib/belt');
const config = require('../config');
const path = require('path');
const rootPath = path.resolve(__dirname,'../../..');
module.exports = router => {
  router.post('/upload', async (ctx) => {
    ctx.validateBody('data').required('Invalid/Missing Data').isString('Invalid/Missing Data');
    ctx.validateBody('filepath').required('Invalid/Missing Filepath').isString('Invalid/Missing Filepath');
      
    const datauri = belt.ensureFile(ctx.vals.data);
    ctx.check(datauri,'Invalid/Missing File');
    const dataBuffer = belt.uriToBuffer(datauri.base64);
    ctx.check(dataBuffer, 'Invalid/Missing File');
    const checkSize =  belt.validateBuffer(dataBuffer, 1024);
    ctx.check(checkSize, 'File size exceeded 1040 kb');
    const filePath = belt.ensureFilePath(datauri.ext,ctx.vals.filepath);
    ctx.check(filePath,`Invalid/Missing File Extension, expected ${datauri.ext}`);
    const saveFile = await belt.saveFile(dataBuffer,path.join(rootPath,ctx.state.userinfo.dir),ctx.vals.filepath);
    ctx.check(saveFile, 'Invalid/Missing File');
    ctx.ok(`https://${ctx.state.userinfo.suburl}.${config.APIURL}/${ctx.vals.filepath}`);
  });
};
