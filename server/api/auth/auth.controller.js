const Joi = require('joi')
const Account = require('../models/account')

const { hash } = require('../../lib/hash')

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6)
})

function schemaValidator (item) {
  return Joi.validate(item, schema)
}

exports.localRegister = async (ctx) => {
  const result = schemaValidator(ctx.request.body)

  if (result.error) {
    ctx.status = 400
    ctx.body = { error: 'Bad Form' }
    return
  }

  const existing = await Account.findByEmail(ctx.request.body.email)
  if (existing) {
    ctx.status = 409
    ctx.body = 'Email Overlapped'
    return
  }

  const { email, password } = ctx.request.body

  const account = new Account({
    email,
    password: hash(password)
  })

  const saving = await account.save().exec()
  if (saving.errors) {
    ctx.status = 400
    ctx.body = 'Saving Error'
  }

  const token = await account.generateToken()
  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
  ctx.body = account
}

exports.localLogin = async (ctx) => {
  const result = schemaValidator(ctx.request.body)
  if (result.error) {
    ctx.status = 400
    ctx.body = { error: 'Bad Form' }
    return
  }

  const { email, password } = ctx.request.body

  const account = await Account.findByEmail(email)
  if (!account || !account.validatePassword(password)) {
    ctx.status = 403
    ctx.body = 'Wrong Account or Password'
    return
  }

  const token = await account.generateToken()

  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
  ctx.body = account
}

exports.exists = async (ctx) => {
  const email = ctx.params.value
  const existing = await Account.findByEmail(email)

  ctx.body = {
    exists: existing !== null
  }
}

exports.logout = async (ctx) => {
  ctx.cookies.set('access_token', null, {
    maxAge: 0,
    httpOnly: true
  })
  ctx.status = 204
}
