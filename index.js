require('babel-core/register')()
require('babel-polyfill')
require('./bin/server.js')

const UpdateNovel = require('./src/utils/updateNovel')
const app = require('./bin/server')
if (app.env === 'production') {
  UpdateNovel.start()
}
