/* eslint-disable semi */
/* eslint-disable require-atomic-updates */
require('dotenv').config()

const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')

app.prepare().then(() => {    
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => { console.log('Successfully connected to mongodb') })
    .catch(e => { console.error(e) })

    const server = new Koa()
    const router = new Router()
    const api = require('./api')

    router.all('*', async ctx => {
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200
        await next()
    })

    server.use(bodyParser())

    server.use(api.routes())
    server.use(router.routes()).use(router.allowedMethods())

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})
