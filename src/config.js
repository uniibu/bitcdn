const envalid = require('envalid');
const { str, bool, port, json } = envalid;

module.exports = envalid.cleanEnv(process.env, {
  PORT: port({ default: 8080 }),
  TRUST_PROXY: bool({ default: false }),
  NODE_ENV: str({ default: 'development' }),
  APIURL: str({ default: 'http://localhost' }),
  KEYS: json()
});
