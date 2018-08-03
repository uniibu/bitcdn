require('dotenv').config();
const server = require('./src/app');
server.listen(server.port, () => {
  console.log(`bitcdn is listening on port ${server.port}`);
});