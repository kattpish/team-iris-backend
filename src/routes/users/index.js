import Router from '@koa/router'
import createHttpError from 'http-errors'
import { hasPermission, jwtParser } from '../../middlewares/index.js'
import * as controllers from './users.controller.js'

const users = new Router({
  prefix: '/users'
})

users
  .post('/', controllers.createUser)
  .use(jwtParser({ required: true }))
  .get('/me', controllers.me)
  .get('/awaiters', hasPermission(99), controllers.getAwaiters)
  .param('email', async (email, ctx, next) => {
    if (
      email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      ).length === 0
    ) {
      throw new createHttpError.NotFound()
    }

    await next()
  })
  .get('/:email', hasPermission(99), controllers.getUserByEmail)
  .patch('/:email', controllers.updateUserByEmail)
  .get('/', hasPermission(99), controllers.getUsers)

export default users
