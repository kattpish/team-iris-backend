import Router from '@koa/router'
import { hasPermission, jwtParser } from '../../../middlewares/index.js'
import * as controllers from './matches.controller.js'

const match = new Router()

match
  .get('/', controllers.getMatches)
  .post(
    '/',
    jwtParser({ required: true }),
    hasPermission(99),
    controllers.createMatches
  )

export default match
