import cors from '@koa/cors'
import Koa from 'koa'
import koaBody from 'koa-body'
import mongoose from 'mongoose'
import routers from './routes/index.js'

const port = parseInt(process.env.PORT, 10) || 3000

const app = new Koa()

mongoose
  .connect(process.env.MONGO_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connected to mongodb')
  })
  .catch(e => {
    console.error(e)
  })

app.use(cors())

app.use(
  koaBody({
    multipart: true,
    formLimit: '15mb',
    formidable: {
      uploadDir: 'uploads/'
    }
  })
)

app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status >= 400) {
      ctx.throw(ctx.status, ctx.message)
    }
  } catch (err) {
    if (err.status) {
      ctx.status = err.status
      ctx.body = {
        error: err.message
      }
    } else {
      console.error(err)
      ctx.status = 500
      ctx.body = {
        error: 'Internal Server Error'
      }
      // TODO log error
    }
  }
})

app.use(routers.routes()).use(routers.allowedMethods())

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`)
})
