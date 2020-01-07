import Router from '@koa/router'
import auth from './auth/index.js'
import leagues from './leagues/index.js'
import users from './users/index.js'

const router = new Router()

router.use(auth.routes()).use(auth.allowedMethods())
router.use(users.routes()).use(users.allowedMethods())
router.use(leagues.routes()).use(leagues.allowedMethods())

export default router
