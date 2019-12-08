/* eslint-disable semi */
/* eslint-disable require-atomic-updates */
require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => { console.log('Successfully connected to mongodb') })
.catch(e => { console.error(e) })

const app = new Koa()
const router = new Router()
const api = require('./api')

router.all('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
})

app.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
})

app.use(bodyParser())

app.use(api.routes())
app.use(router.routes()).use(router.allowedMethods())

const jwt = require('jsonwebtoken')
const token = jwt.sign({ foo: 'bar' }, 'secret-key', { expiresIn: '7d' }, (err, token) => {
    if(err) {
        console.log(err)
        return
    }

    console.log(token)
})


app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
})