import Router from '@koa/router'
import { hasPermission, jwtParser } from '../../middlewares/index.js'
import * as controllers from './teams.controller.js'

const team = new Router({
  prefix: '/teams'
})

team
  .get('/', controllers.getTeams)
  .post(
    '/',
    jwtParser({ required: true }),
    hasPermission(99),
    controllers.createTeam
  )
  .get('/:id', controllers.getTeamById)
  .patch(
    '/:id',
    jwtParser({ required: true }),
    hasPermission(99),
    controllers.updateTeamById
  )

export default team
