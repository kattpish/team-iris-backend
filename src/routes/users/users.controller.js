import bcrypt from 'bcrypt'
import createError from 'http-errors'
import Joi from 'joi'
import Account from '../../models/account.js'
import { updateUserInput } from './users.scheme.js'

export const getUsers = async ctx => {
  const users = await Account.find()
    .lean()
    .exec()
  ctx.body = {
    users
  }
}

export const me = async ctx => {
  if (!ctx.state.user) {
    throw new createError.Unauthorized()
  }
  ctx.body = ctx.state.user.toObject()
}

export const getUserByEmail = async ctx => {
  const user = await Account.findOne({ email: ctx.params.email })
    .lean()
    .exec()
  if (!user) {
    throw new createError.NotFound()
  }

  ctx.body = user
}

export const getAwaiters = async ctx => {
  const users = await Account.find({ verified: false })
    .lean()
    .exec()

  ctx.body = { users }
}

export const updateUserByEmail = async ctx => {
  const email = ctx.params.email
  const user = ctx.state.user

  // jwtParser({ required: true }) 미들웨어가 선행되면 의미없는 조건문
  if (!user) {
    throw new createError.Unauthorized()
  }

  // 본인 계정이 아니면서 관리자도 아닌 경우
  if (user.email !== email && user.permission < 99) {
    throw new createError.Forbidden()
  }

  const { error, value } = Joi.validate(ctx.body, updateUserInput)

  if (error) throw new createError.BadRequest()

  for (const key in value) {
    // 패스워드 수정
    if (key === 'password') {
      // TODO 토큰 발급 시간이 1분이 안 지났을 경우만 허용 (다시 로그인)
      user[key] = await bcrypt.hash(value[key])
      continue
    }
    user[key] = value[key]
  }

  // 본인이 본인 정보 수정한 경우 다시 인증받아야 함
  if (user.permission < 99) {
    user.verified = false
  }

  try {
    await user.save()
  } catch (err) {
    throw new createError.InternalServerError(err.message)
  }

  ctx.body = user.toObject()
}
