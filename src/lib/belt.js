const fs = require('fs-extra');
const path = require('path');
const allowedFiles = {
  image: {'png':{ext:'.png'},'jpeg':{ext:'.jpeg'},'jpg':{ext:'.jpg'},'gif':{ext:'.gif'},'x-icon':{ext:'.ico'},'svg+xml':{ext:'.svg'},'tiff':{ext:'.tiff'}, 'webp':{ext:'.webp'}},
  application: {'javascript':{ext:'.js'},'json':{ext:'.json'},'xml':{ext:'.xml'}},
  text: {'css':{ext:'.css'}}
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
exports.ensureFile = datauri => {
  const parts = datauri.split(',');
  if (parts.length < 2 || parts.length > 2) {
    return false;
  } 
  const parsedData = datauri.match(/^data:(.+);base64,(.+)$/);
  const fileType = parsedData[1].split('/');
  var allowed = allowedFiles[fileType[0]];
  if(!allowed || !Object.keys(allowed).includes(fileType[1]) || !isBase64(parsedData[2])){
    return false;
  }
  return { ext:allowed[fileType[1]].ext, base64:parsedData[2] };
};
exports.ensureFilePath = (ext,filepath) => {
  return path.extname(filepath) === ext;
};
exports.uriToBuffer = base64 => {
  return Buffer.from(base64, 'base64');
};

exports.validateBuffer = (buff, maxSize) => {
  const inKb = Buffer.byteLength(buff) / 1040;
  if(inKb > maxSize){
    return false;
  }
  return true;
};
exports.saveFile = async (buff, dir, filepath) => {
  try{
    await fs.outputFile(path.join(dir,filepath),buff);
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
};