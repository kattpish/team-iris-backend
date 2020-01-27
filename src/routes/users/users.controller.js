import bcrypt from 'bcrypt'
import fs from 'fs'
import createHttpError from 'http-errors'
import Joi from 'joi'
import path from 'path'
import Account from '../../models/account.js'
import { createUserInput, updateUserInput } from './users.scheme.js'

export const createUser = async ctx => {
  const result = Joi.validate(ctx.request.body, createUserInput)
  const avator = ctx.request.files.avator
  const unlinkAvator = () => fs.promises.unlink(path.resolve(avator.path))

  if (!avator) {
    throw new createHttpError.BadRequest()
  }

  if (result.error || avator.size === 0) {
    await unlinkAvator()
    throw new createHttpError.BadRequest()
  }

  try {
    const account = new Account({
      name: result.value.name,
      email: result.value.email,
      password: await bcrypt.hash(result.value.password, 10),
      position: result.value.position,
      avator: avator.path
    })
    await account.save()

    ctx.body = account.toObject()
  } catch (err) {
    console.log(err)
    await unlinkAvator()
    if (err.name === 'MongoError') {
      if (err.code === 11000) {
        throw new createHttpError.BadRequest('이미 가입된 이메일입니다.')
      }
    }
    throw new createHttpError.BadRequest('잘못된 요청입니다.')
  }
}

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
    throw new createHttpError.Unauthorized('로그인을 해주세요.')
  }
  ctx.body = ctx.state.user.toObject()
}

export const getUserByEmail = async ctx => {
  const user = await Account.findOne({ email: ctx.params.email })
    .lean()
    .exec()
  if (!user) {
    throw new createHttpError.NotFound()
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
  // TODO 프로필사진 수정

  const email = ctx.params.email
  const user = ctx.state.user
  const targetUser = await Account.findOne({ email })

  // jwtParser({ required: true }) 미들웨어가 선행되면 의미없는 조건문
  if (!user) {
    throw new createHttpError.Unauthorized()
  }

  if (!targetUser) {
    throw new createHttpError.NotFound()
  }

  // 본인 계정이 아니면서 관리자도 아닌 경우
  if (user.email !== email && user.permission < 99) {
    throw new createHttpError.Forbidden()
  }

  const { error, value } = Joi.validate(ctx.request.body, updateUserInput)

  if (error) throw new createHttpError.BadRequest()

  for (const key in value) {
    // 패스워드 수정
    if (key === 'password') {
      // TODO 토큰 발급 시간이 1분이 안 지났을 경우만 허용 (다시 로그인)
      targetUser[key] = await bcrypt.hash(value[key])
      continue
    }
    if (user.permission < 99) {
      if (key === 'permission' || key === 'verified') {
        throw new createHttpError.Forbidden()
      }
    }
    targetUser[key] = value[key]
  }

  // 본인이 본인 정보 수정한 경우 다시 인증받아야 함
  if (user.permission < 99) {
    targetUser.verified = false
  }

  try {
    await targetUser.save()
  } catch (err) {
    throw new createHttpError.InternalServerError()
  }

  ctx.body = targetUser.toObject()
}
