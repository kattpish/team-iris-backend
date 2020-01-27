import createHttpError from 'http-errors'
import Joi from 'joi'
import Account from '../../models/account.js'
import { loginInput } from './auth.scheme.js'

export const login = async ctx => {
  const result = Joi.validate(ctx.request.body, loginInput)
  if (result.error) {
    throw new createHttpError.BadRequest()
  }

  const { email, password } = result.value

  const account = await Account.findOne({ email })
    .select('+password')
    .exec()

  if (!account || !(await account.validatePassword(password))) {
    throw new createHttpError.Unauthorized()
  }

  const token = await account.generateToken()

  ctx.body = { token }
}
