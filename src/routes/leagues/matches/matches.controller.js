import createHttpError from 'http-errors'
import Joi from 'joi'
import Match from '../../../models/match.js'
import { createMatchInput } from './matches.scheme.js'

export const createMatches = async ctx => {
  const result = Joi.validate(ctx.body, createMatchInput)

  if (result.error) {
    throw new createHttpError.BadRequest()
  }

  try {
    const newMatch = new Match({
      leagueId: ctx.params.leagueId,
      ...result.value
    })

    await newMatch.save()
  } catch (err) {
    throw new createHttpError.BadRequest()
    // TODO 예외처리
  }
}

export const getMatches = async ctx => {}

export const editMatches = async ctx => {}
