import bcrypt from 'bcrypt'
import createError from 'http-errors'
import Joi from 'joi'
import Account from '../../models/account.js'
import { loginInput, registerInput } from './auth.scheme.js'

export const register = async ctx => {
  const result = Joi.validate(ctx.request.body, registerInput)

  if (result.error) {
    throw new createError.BadRequest()
  }

  try {
    const account = new Account({
      name: result.value.name,
      email: result.value.name,
      password: await bcrypt.hash(result.value.password),
      position: result.value.position
    })
    await account.save()

    ctx.body = account.toObject()
  } catch (err) {
    throw new createError.BadRequest()
  }
}

export const login = async ctx => {
  const result = Joi.validate(ctx.request.body, loginInput)
  if (result.error) {
    throw new createError.BadRequest()
  }

  const { email, password } = result.value

  const account = await Account.findOne({ email })
    .select('+password')
    .exec()

  if (!account || !(await account.validatePassword(password))) {
    throw new createError.NotFound()
  }

  const token = await account.generateToken()

  ctx.body = { token }
}
