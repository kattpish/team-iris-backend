const Router = require('koa-router')

const api = new Router({
  prefix: '/api'
})
const auth = require('./auth')

api.use(auth.routes())
api.use(auth.allowedMethods())

module.exports = api
