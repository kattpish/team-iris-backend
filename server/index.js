require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')

const port = parseInt(process.env.PORT, 10) || 3000

const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()
const api = require('./api')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => { console.log('Successfully connected to mongodb') })
  .catch(e => { console.error(e) })

app.use(async (ctx, next) => {
  ctx.res.statusCode = 200
  await next()
})

app.use(bodyParser())

app.use(api.routes()).use(api.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`)
})
