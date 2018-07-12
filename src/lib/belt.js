const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

const allowedFiles = {
  image: {'png':{ext:'.png'},'jpeg':{ext:'.jpeg'},'jpg':{ext:'.jpg'},'gif':{ext:'.gif'},'x-icon':{ext:'.ico'},'svg+xml':{ext:'.svg'},'tiff':{ext:'.tiff'}, 'webp':{ext:'.webp'}},
  application: {'javascript':{ext:'.js'},'json':{ext:'.json'},'xml':{ext:'.xml'}},
  text: {'css':{ext:'.css'}}
};
const sharpOpts = {
  jpeg: {quality:70},
  png: {progressive: false},
  webp:{lossless: true }
};

function isBase64 (str) {
  const notBase64 = /[^A-Z0-9+/=]/i;
  const len = str.length;
  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }
  const firstPaddingChar = str.indexOf('=');
  return (
    firstPaddingChar === -1 || firstPaddingChar === len - 1 || (firstPaddingChar === len - 2 && str[len - 1] === '=')
  );
}
function generateRand(size=3){
  return crypto.randomBytes(size).toString('hex');
}
function formatPath(type, fpath, data){
  const pathObj = path.parse(fpath);
  if(type == 'name'){
    return path.format({
      dir: pathObj.dir,
      name: `${pathObj.name}-${data}`,
      ext: pathObj.ext
    });
  }else if(type == 'ext'){
    return path.format({
      dir: pathObj.dir,
      name: pathObj.name,
      ext: data
    });
  }
}

exports.validateFile = async (dataUri, dir, filepath, maxSize=1024,convert=false) => {
  const parts = dataUri.split(',');
  if (parts.length < 2 || parts.length > 2) {
    throw new Error('Invalid data');
  } 
  const parsedData = dataUri.match(/^data:(.+);base64,(.+)$/);
  const base64Data = parsedData[2];
  const fileType = parsedData[1].split('/');
  const allowed = allowedFiles[fileType[0]];
  if(!allowed || !Object.keys(allowed).includes(fileType[1]) || !isBase64(base64Data)){
    throw new Error('Invalid data');
  }
  const fileExt = allowed[fileType[1]].ext;
  const filepathExt = path.extname(filepath);
  if(filepathExt !== fileExt){
    filepath = formatPath('ext',filepath,fileExt);    
  }
  const base64Buff = Buffer.from(base64Data, 'base64');
  if(!base64Buff){
    throw new Error('Invalid data');
  }
  const inKb = Buffer.byteLength(base64Buff) / 1024;
  if(inKb > maxSize){
    throw new Error('File size exceeded 1024 kb');
  }
  
  try{
    let relativePath = path.join(dir,filepath);
    if(fs.existsSync(relativePath)){
      relativePath = formatPath('name',relativePath,generateRand());
    }
    if(fileType[0] == 'image' && ['.jpg','.jpeg','.png','.webp'].includes(fileExt)){
      let sharpImg = sharp(base64Buff);
      if(convert){
        convert = convert == 'jpg' ? 'jpeg':convert;
        relativePath = formatPath('ext',relativePath,`.${convert}`);
        sharpImg = sharpImg[convert](sharpOpts[convert]);
      }

      await fs.ensureDir(path.dirname(relativePath));
      await sharpImg.toFile(relativePath);        
    }else{
      console.log('here');
      await fs.outputFile(relativePath,base64Buff);
    }
    return path.join(path.dirname(filepath),path.basename(relativePath));
  }catch(e){
    console.log(e);
    throw new Error('Error occured while saving your file');
  }
};