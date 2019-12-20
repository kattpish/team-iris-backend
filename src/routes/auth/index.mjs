import Router from '@koa/router'
import * as authCtrl from './auth.controller.mjs'

const auth = new Router({
  prefix: '/auth'
})

auth.post('/register', authCtrl.register)
auth.post('/login', authCtrl.login)

export default auth
