import Router from '@koa/router'
import * as controllers from './auth.controller.js'

const auth = new Router({
  prefix: '/auth'
})

auth.post('/register', controllers.register)
auth.post('/login', controllers.login)

export default auth
