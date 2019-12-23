import Router from '@koa/router'
import createError from 'http-errors'
import { hasPermission, jwtParser } from '../../middlewares/index.mjs'
import * as controllers from './users.controller.mjs'

const users = new Router({
  prefix: '/users'
})

users.use(jwtParser({ required: true }))

users.get('/', hasPermission(99), controllers.getAllUsers)

users.get('/me', controllers.me)

users.get('/awaiters', hasPermission(99), controllers.getAwaiters)

users
  .param('email', async (email, ctx, next) => {
    if (
      email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      ).length === 0
    ) {
      throw new createError.NotFound()
    }

    await next()
  })
  .get('/:email', hasPermission(99), controllers.getUserByEmail)
  .patch('/:email', controllers.updateUserByEmail)

export default users
