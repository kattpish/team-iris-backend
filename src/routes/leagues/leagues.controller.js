import createHttpError from 'http-errors'
import Joi from 'joi'
import League from '../../models/league.js'
import { createLeagueInput } from './leagues.scheme.js'

export const getLeagues = async ctx => {
  const leagues = await League.find()
    .populate('matches')
    .lean()
    .exec()
  ctx.body = {
    leagues
  }
}

export const createLeague = async ctx => {
  const result = Joi.validate(ctx.request.body, createLeagueInput)

  if (result.error) {
    throw new createHttpError.BadRequest()
  }

  try {
    const league = new League({
      name: result.value.name,
      location: result.value.location,
      date: result.value.date
    })

    await league.save()
    ctx.body = league.toObject()
  } catch (err) {
    throw new createHttpError.BadRequest()
  }
}
