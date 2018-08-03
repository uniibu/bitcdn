
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

  

## API - Private

`/upload` - [POST] => [JSON]

- Body Parameters

	- `token` the token for authentication

	- `data` the datauri with format of `data:...mimetype;base64,...base64data`

	- `filepath` the filepath to save the file eg. `js/myjs.js`

- Query Parameters [Optional]

	- `convert` to convert the image to specified format. Allowed values are either `jpg`, `jpeg`, `png` or `webp`

	- `optimized` Adding this query will return two images in an Object format. `{original,optimized}`

	- `original` is the original uploaded image

	- `optimized` is the optimized `webp` image

- returns => [JSON]

	- `success` => [BOOLEAN]

	- `data` => [STRING|OBJECT] - the url for the uploaded file
---
`/uploadurl` - [POST] => [JSON]

- Body Parameters

	- `token` the token for authentication

	- `url` the url of the file to upload, the url must respond with cors headers enabled

- Query Parameters [Optional]

	- `convert` to convert the image to specified format. Allowed values are either `jpg`, `jpeg`, `png` or `webp`

	- `optimized` Adding this query will return two images in an Object format. `{original,optimized}`

	- `original` is the original uploaded image

	- `optimized` is the optimized `webp` image

- returns => [JSON]

	- `success` => [BOOLEAN]

	- `data` => [STRING|OBJECT] - the url for the uploaded file
---

`/deleteimage` - [POST] => [JSON]

- Body Parameters

	- `token` the token for authentication

	- `filename` the filename with out the extenstion.

- returns => [JSON]

	- `success` => [BOOLEAN]