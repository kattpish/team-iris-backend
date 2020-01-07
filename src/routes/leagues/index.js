import Router from '@koa/router'
import { hasPermission, jwtParser } from '../../middlewares/index.js'
import * as controllers from './leagues.controller.js'
import matchRouter from './matches/index.js'

const league = new Router({
  prefix: '/leagues'
})

league
  .get('/', controllers.getLeagues)
  .post(
    '/',
    jwtParser({ required: true }),
    hasPermission(99),
    controllers.createLeague
  )

league.use('/:id/matches', matchRouter.routes(), matchRouter.allowedMethods())

export default league
