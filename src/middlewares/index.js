import createHttpError from 'http-errors'
import Account from '../models/account.js'
import { parseToken } from '../utils/token.js'

export const jwtParser = ({ required = false }) => async (ctx, next) => {
  const token = ctx.request.header.authorization

  if (!token && !required) {
    // 토큰이 없는데 required가 거짓이면 (default)
    await next()
    return
  } else if (!token) {
    // 토큰이 없는데 required가 참이면
    throw new createHttpError.Unauthorized()
  }

  try {
    const userData = await parseToken(token.replace('Bearer ', ''))
    ctx.state.user = await Account.findOne({ email: userData.email })
    if (!ctx.state.user) {
      throw new Error('Wrong token given.')
    }
  } catch (err) {
    throw createHttpError(401, err)
  }

  await next()
}

export const hasPermission = level => async (ctx, next) => {
  const user = ctx.state.user

  if (!user) {
    throw new createHttpError.Unauthorized()
  }

  if (level > user.permission) {
    throw new createHttpError.Forbidden()
  }

  await next()
}
