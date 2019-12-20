import Router from '@koa/router'
import auth from './auth/index.mjs'

const router = new Router()

router.use(auth.routes()).use(auth.allowedMethods())

export default router
