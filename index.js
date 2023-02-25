const express = require('express');
const app = express();
const {config} = require('./config/config')



app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`)
})
