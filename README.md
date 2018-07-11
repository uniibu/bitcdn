# bitcdn
Api codebase of bitcdn

## Setup
- clone this repo
- install dependencies
- create `.env` file, eg.
  ```
APIURL=bitcdn.host
PORT=7556
NODE_ENV=production
TRUST_PROXY=true
KEYS=[{"dir":"rootfolder","suburl":"f","uuid":"6408bf6b-9db1-4f58-9363-3a10aa428940"}]
```
- start the app `node index.js`

## API
`/upload` - [POST] => [JSON]
  - `token` the token for authentication
  - `data` the datauri with format of `data:...mimetype;base64,...base64data`
  - `filepath` the filepath to save the file eg. `js/myjs.js`
  - returns => [JSON]
    - `success` => [BOOLEAN]
    - `data` => [STRING] - the url for the uploaded file