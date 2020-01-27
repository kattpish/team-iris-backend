import createHttpError from 'http-errors'
import Joi from 'joi'
import Account from '../../models/account.js'
import Team from '../../models/team.js'
import { createTeamInput, updateTeamInput } from './teams.scheme.js'

export const createTeam = async ctx => {
  const result = Joi.validate(ctx.request.body, createTeamInput)
  const logo = ctx.request.files.logo

  if (result.error) {
    throw new createHttpError.BadRequest()
  }

  try {
    const newTeam = new Team({
      name: result.value.name,
      logo: logo.path
    })
    await newTeam.save()
    ctx.body = newTeam.toObject()
  } catch (err) {
    console.log(err)
    throw new createHttpError.BadRequest()
    // TODO 예외처리
  }
}

export const getTeams = async ctx => {
  const query = {}
  if (ctx.request.query.name) {
    query.name = ctx.request.query.name
  }
  const teams = await Team.find(query)
    .lean()
    .exec()

  if (ctx.request.query.populate === 'true') {
    for (const team of teams) {
      team.players = await Account.find({ team: team._id })
    }
  }
  ctx.body = { teams }
}

export const getTeamById = async ctx => {
  const team = await Team.findOne({ _id: ctx.params.id })
    .lean()
    .exec()
  ctx.body = team
}

export const updateTeamById = async ctx => {
  const result = Joi.validate(updateTeamInput, ctx.request.body)
  if (result.error) {
    throw new createHttpError.BadRequest()
  }

  const team = await Team.findOne({ _id: ctx.params.id })
  if (!team) {
    throw new createHttpError.NotFound()
  }

  for (const key in result.value) {
    team[key] = result.value[key]
  }
  await team.save()

  ctx.body = team.toObject()
}
