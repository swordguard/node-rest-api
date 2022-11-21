const http = require('http')
const app = require('./app')
// const nodemon = require('nodemon')

const port = process.env.PORT || 3001

const server = http.createServer(app)

server.listen(port)