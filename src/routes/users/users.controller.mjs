import createError from 'http-errors'
import Account from '../../models/account.mjs'

export const getAllUsers = async ctx => {
  const users = await Account.find()
    .lean()
    .exec()
  ctx.body = {
    users
  }
}

export const me = async ctx => {
  ctx.body = ctx.state.user
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

export const updateUserByEmail = async ctx => {}
